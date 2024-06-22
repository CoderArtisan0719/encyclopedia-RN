// StickyNoteEditor.tsx
import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

type RootStackParamList = {
  StickyNotes: undefined;
  StickyNoteEditor: {note?: Note};
};

type StickyNoteEditorNavigationProp = StackNavigationProp<
  RootStackParamList,
  'StickyNoteEditor'
>;

type StickyNoteEditorRouteProp = RouteProp<
  RootStackParamList,
  'StickyNoteEditor'
>;

type Props = {
  navigation: StickyNoteEditorNavigationProp;
  route: StickyNoteEditorRouteProp;
};

type Note = {
  id: number;
  title: string;
  text: string;
};

const StickyNoteEditor: React.FC<Props> = ({navigation, route}) => {
  const {note} = route.params || {};
  const [noteTitle, setNoteTitle] = useState<string>(note?.title || '');
  const [noteText, setNoteText] = useState<string>(note?.text || '');

  const handleSave = () => {
    const updatedNote = {...note, title: noteTitle, text: noteText};
    navigation.navigate('StickyNotes', {updatedNote});
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
            <Icon name="save" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor="#999"
        value={noteTitle}
        onChangeText={setNoteTitle}
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Type something..."
        placeholderTextColor="#999"
        value={noteText}
        onChangeText={setNoteText}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconGroup: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  titleInput: {
    fontSize: 24,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 20,
  },
  contentInput: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
    textAlignVertical: 'top',
  },
});

export default StickyNoteEditor;
