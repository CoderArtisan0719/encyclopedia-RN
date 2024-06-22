import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../../App';
import axiosInstance from "../config/axios"

type BookDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookDetail'
>;

type BookDetailScreenRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;

type Props = {
  navigation: BookDetailScreenNavigationProp;
  route: BookDetailScreenRouteProp;
};

const { width, height } = Dimensions.get('window');

const BookDetail: React.FC<Props> = ({ route, navigation }) => {
  const { book, title } = route.params;
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const pagerViewRef = useRef<PagerView>(null);

  useEffect(() => {
    navigation.setOptions({ title, headerRight: bookmarkButton});

    const fetchBookContent = async () => {
      setLoading(true);
      try {
        const initialUrl = book.formats['text/html'];
        const bookId = initialUrl.match(/\/(\d+)\.html/)![1];
        const baseUrl = `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`;
        const response = await fetch(baseUrl);
        const text = await response.text();
        setContent(text);
        splitIntoPages(text);
        loadBookmarks(bookId);
      } catch (error) {
        console.error('Failed to fetch book content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookContent();
  }, [book, navigation, title]);

  const bookmarkButton = () => (
    <TouchableOpacity
      style={[styles.bookmarkIcon]}
      onPress={() => saveBookmarks()}>
      <Icon name={'bookmark-o'} size={24} color="black" />
    </TouchableOpacity>
  )

  const splitIntoPages = (text: string) => {
    const words = text.split(' ');
    const pageLimit = Math.floor((width * height) / (16 * 2.5)); // Rough estimate of characters per page
    let currentPage = '';
    const pagesArray = [];

    words.forEach(word => {
      if (currentPage.length + word.length + 1 > pageLimit) {
        pagesArray.push(currentPage);
        currentPage = word;
      } else {
        currentPage += (currentPage ? ' ' : '') + word;
      }
    });
    pagesArray.push(currentPage); // Push the last page

    setPages(pagesArray);
  };

  const loadBookmarks = async (bookId: string) => {
    try {
      const savedBookmarks = await AsyncStorage.getItem(`bookmarks_${bookId}`);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const saveBookmarks = async () => {
    try {
      const bookId = book.formats['text/html'].match(/\/(\d+)\.html/)![1];
      // console.log(bookId, newBookmarks);
      // await AsyncStorage.setItem(
      //   `bookmarks_${bookId}`,
      //   JSON.stringify(newBookmarks)
      // );
      // setBookmarks(newBookmarks);
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(pageIndex);
    }
  };

  const toggleBookmark = (pageIndex: number) => {
    const newBookmarks = bookmarks.includes(pageIndex)
      ? bookmarks.filter(b => b !== pageIndex)
      : [...bookmarks, pageIndex];
    saveBookmarks(newBookmarks);
  };

  const DogEar = () => (
    <View style={styles.dogEar}>
      <Icon name="bookmark" size={10} color="#fff" />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerViewRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={e => handlePageChange(e.nativeEvent.position)}>
        {pages.map((page, index) => (
          <View key={index} style={styles.page}>
            <Text style={styles.content}>{page}</Text>
            {bookmarks.includes(index) && <DogEar />}
            
          </View>
        ))}
      </PagerView>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={pages.length - 1}
        step={1}
        value={currentPage}
        onValueChange={value => setCurrentPage(value)}
        onSlidingComplete={value => handlePageChange(value)}
      />
      <Text style={styles.pageIndicator}>{`${currentPage + 1} / ${pages.length}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    padding: 20,
    color: '#333',
    position: 'relative', // Added for positioning bookmark icon
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 16,
    color: '#fff',
  },
  slider: {
    width: '80%',
    alignSelf: 'center',
    marginVertical: 5,
  },
  pageIndicator: {
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 16,
    color: '#fff',
  },
  bookmarkIcon: {
    // position: 'absolute',
    // top: 10,
    // right: 10,
  },
  bookmarked: {
    color: 'yellow',
  },
  dogEar: {
    width: 20,
    height: 20,
    backgroundColor: 'yellow',
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookDetail;
