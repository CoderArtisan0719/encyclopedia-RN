import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Book} from '../navigation/RootStackParamList';

type RootStackParamList = {
  BookList: undefined;
  BookDetail: {book: Book; title: string};
  StickyNoteEditor: {note?: Note};
};

type StickyNotesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookList'
>;

type StickyNotesScreenRouteProp = RouteProp<RootStackParamList, 'BookList'>;

type Props = {
  navigation: StickyNotesScreenNavigationProp;
  route: StickyNotesScreenRouteProp;
};

type Note = {
  id: number;
  title: string;
  text: string;
};

const mockNotes: Note[] = [
  {
    id: 1,
    title: 'Meeting Notes',
    text: 'Discuss project timeline and milestones',
  },
  {id: 2, title: 'Grocery List', text: 'Milk, Bread, Eggs, Butter'},
  {id: 3, title: 'Todo', text: 'Finish React Native project, Review PRs'},
  {id: 4, title: 'Ideas', text: 'New app feature ideas, Improvements to UI'},
  {
    id: 5,
    title: 'Books to Read',
    text: 'The Great Gatsby, 1984, To Kill a Mockingbird',
  },
  {id: 6, title: 'Shopping List', text: 'Shoes, Jacket, Sunglasses'},
  {
    id: 7,
    title: 'Workout Plan',
    text: 'Monday: Chest, Tuesday: Back, Wednesday: Legs',
  },
  {id: 8, title: 'Recipe', text: 'Pasta, Tomato Sauce, Basil'},
  {id: 9, title: 'Travel Plans', text: 'Paris, Rome, New York'},
  {id: 10, title: 'Goals', text: 'Learn a new language, Run a marathon'},
  {
    id: 11,
    title: 'Work Tasks',
    text: 'Complete project report, Attend team meeting',
  },
  {
    id: 12,
    title: 'Home Improvement',
    text: 'Paint the living room, Fix the sink',
  },
  {id: 13, title: 'Movie List', text: 'Inception, The Matrix, Interstellar'},
  {
    id: 14,
    title: 'Songs to Learn',
    text: 'Imagine, Hey Jude, Bohemian Rhapsody',
  },
  {id: 15, title: 'Gift Ideas', text: 'Watch, Perfume, Book'},
  {
    id: 16,
    title: 'Bucket List',
    text: 'Skydiving, Scuba Diving, Bungee Jumping',
  },
  {id: 17, title: 'Books to Buy', text: 'Sapiens, Homo Deus, 21 Lessons'},
  {id: 18, title: 'Conference Notes', text: 'AI trends, Cloud computing'},
  {id: 19, title: 'Event Planning', text: 'Venue, Catering, Invitations'},
  {
    id: 20,
    title: 'Gardening Tips',
    text: 'Watering schedule, Best fertilizers',
  },
];

const StickyNotes: React.FC<Props> = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [longPressedNote, setLongPressedNote] = useState<Note | null>(null);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.updatedNote) {
      const updatedNote = route.params.updatedNote;
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === updatedNote.id ? updatedNote : note,
        ),
      );
    }
  }, [route.params?.updatedNote]);

  const renderItem = ({item}: {item: Note}) => (
    <TouchableOpacity
      style={[
        styles.noteItem,
        {
          backgroundColor: longPressedNote === item ? 'red' : '#f7dd00',
        },
      ]}
      onPress={() => {
        if (longPressedNote !== item) {
          navigation.navigate('StickyNoteEditor', {note: item});
        }
      }}
      onLongPress={() => setLongPressedNote(item)}>
      {longPressedNote === item ? (
        <>
          <TouchableOpacity
            style={styles.deleteIconContainer}
            onPress={() => handleDeleteNote(item)}>
            <Icon name="trash" size={40} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => setLongPressedNote(null)}>
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.noteTitle}>{item.title}</Text>
          <Text style={styles.noteContent}>{item.text}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  const handleDeleteNote = (note: Note) => {
    // Filter out the note item to be deleted
    const updatedNotes = notes.filter(n => n.id !== note.id);
    // Update the state with the updated notes
    setNotes(updatedNotes);
    // Clear the long pressed note state
    setLongPressedNote(null);
  };

  const handleAddNote = () => {
    navigation.navigate('StickyNoteEditor');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  noteItem: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    position: 'relative',
    alignItems: 'center', // Center align the content
    justifyContent: 'center', // Center align the content
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#767676',
  },
  noteContent: {
    color: '#767676',
  },
  listContent: {
    paddingBottom: 100,
  },
  deleteIconContainer: {
    padding: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default StickyNotes;
