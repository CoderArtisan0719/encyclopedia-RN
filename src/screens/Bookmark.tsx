import React, {useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ListRenderItemInfo,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import useFetchBookmarks from '../hooks/useFetchBookmarks';

// type RootStackParamList = {
//   BookDetail: {bookId: string; pageIndex: number};
// };

type Bookmark = {
  bookId: string;
  pageIndex: number;
};

const Bookmarks: React.FC = () => {
  const {bookmarks, loading} = useFetchBookmarks();
  const navigation = useNavigation();

  const handlePress = (bookId: string, pageIndex: number) => {
    navigation.navigate('BookDetail', {bookId, pageIndex});
  };

  const renderItem = ({item}: ListRenderItemInfo<Bookmark>) => (
    <TouchableOpacity onPress={() => handlePress(item.bookId, item.pageIndex)}>
      <View style={styles.bookmarkItem}>
        <Image
          source={{
            uri: `https://www.gutenberg.org/cache/epub/${item.bookId}/pg${item.bookId}.cover.medium.jpg`,
          }}
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
      ListFooterComponent={() =>
        loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
      }
      keyExtractor={(item, index) =>
        `${item.bookId}_${item.pageIndex}_${index}`
      }
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

export default Bookmarks;
