import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

type Bookmark = {
  bookId: string;
  pageIndex: number;
};

const DogEar: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const bookmarkKeys = keys.filter(key => key.startsWith('bookmarks_'));
        const allBookmarks = await AsyncStorage.multiGet(bookmarkKeys);
        const parsedBookmarks = allBookmarks.flatMap(([key, value]) => {
          const bookId = key.split('_')[1];
          const pages = JSON.parse(value || '[]');
          return pages.map((pageIndex: number) => ({
            bookId,
            pageIndex,
          }));
        });
        setBookmarks(parsedBookmarks);
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handlePress = (bookId: string, pageIndex: number) => {
    navigation.navigate('BookDetail', { bookId, pageIndex });
  };

  const renderItem = ({ item }: { item: Bookmark }) => (
    <TouchableOpacity onPress={() => handlePress(item.bookId, item.pageIndex)}>
      <View style={styles.bookmarkItem}>
        <Image
          source={{ uri: `https://www.gutenberg.org/cache/epub/${item.bookId}/pg${item.bookId}.cover.medium.jpg` }}
          style={styles.bookImage}
        />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{`Book ${item.bookId}`}</Text>
          <Text style={styles.bookPage}>{`Page ${item.pageIndex + 1}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={bookmarks}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.bookId}_${item.pageIndex}_${index}`}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bookImage: {
    width: 50,
    height: 70,
  },
  bookInfo: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookPage: {
    fontSize: 14,
    color: '#666',
  },
});

export default DogEar;
