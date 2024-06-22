import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ListRenderItemInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

// Define types for the navigation and route
type RootStackParamList = {
  BookList: undefined;
  BookDetail: {book: Book; title: string};
};

type BookListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookList'
>;

type BookListScreenRouteProp = RouteProp<RootStackParamList, 'BookList'>;

type Props = {
  navigation: BookListScreenNavigationProp;
  route: BookListScreenRouteProp;
};

type Book = {
  id: number;
  title: string;
  authors: {name: string}[];
  formats: {
    'image/jpeg': string;
  };
};

const BookListScreen: React.FC<Props> = ({navigation}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchBooks = async () => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://gutendex.com/books/?search=${searchQuery}&page=${page}`,
      );
      const data = await response.json();
      setBooks(prevBooks => [...prevBooks, ...data.results]);
      setPage(prevPage => prevPage + 1);
      setHasMore(data.next !== null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}: ListRenderItemInfo<Book>) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('BookDetail', {book: item, title: item.title})
      }>
      <View style={styles.bookItem}>
        <Image
          source={{uri: item.formats['image/jpeg']}}
          style={styles.bookImage}
        />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>
            {item.authors.map(author => author.name).join(', ')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#ccc" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            setBooks([]);
            setPage(1);
            setHasMore(true);
          }}
        />
      </View>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContent}
        onEndReached={fetchBooks}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookImage: {
    width: 70,
    height: 85,
    borderRadius: 5,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#555',
  },
});

export default BookListScreen;
