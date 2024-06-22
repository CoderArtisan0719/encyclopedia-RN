import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BookListScreen from './src/screens/BookList';
import BookDetail from './src/screens/BookContent';
import DogEar from './src/screens/DogEar';
import Bookmarks from './src/screens/Bookmark';
import StickyNotes from './src/screens/StickyNotes';
import StickyNoteEditor from './src/screens/StickyNoteEditor';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RecoilRoot } from 'recoil';

type RootStackParamList = {
  BookList: undefined;
  BookDetail: {book: Book; title: string};
  StickyNoteEditor: undefined;
};

type Book = {
  id: number;
  title: string;
  authors: {name: string}[];
  formats: {
    'image/jpeg': string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TopTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'book';
          } else if (route.name === 'Bookmark') {
            iconName = focused ? 'bookmark' : 'bookmark-o';
          } else if (route.name === 'Note') {
            iconName = focused ? 'sticky-note' : 'sticky-note-o';
          } else if (route.name === 'Dog-ear') {
            iconName = focused ? 'file' : 'file-o';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#673ab7',
        tabBarInactiveTintColor: '#222',
      })}>
      <Tab.Screen
        name="Home"
        component={BookListScreen}
        options={{title: 'Books'}}
      />
      <Tab.Screen
        name="Dog-ear"
        component={DogEar}
        options={{title: 'Dog Ear'}}
      />
      <Tab.Screen
        name="Bookmark"
        component={Bookmarks}
        options={{title: 'Bookmark'}}
      />
      <Tab.Screen
        name="Note"
        component={StickyNotes}
        options={{title: 'Notes'}}
      />
    </Tab.Navigator>
  );
}

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="BookList"
            component={TopTabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BookDetail"
            component={BookDetail}
            options={{headerBackTitleVisible: false}}
          />
          <Stack.Screen
            name="StickyNotes"
            component={StickyNotes}
            options={{headerBackTitleVisible: false}}
          />
          <Stack.Screen
            name="StickyNoteEditor"
            component={StickyNoteEditor}
            options={{
              title: 'Add Note',
              headerBackTitleVisible: true,
              headerShown: false,
            }}
          />
          <Stack.Screen name="Bookmarks" component={Bookmarks} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
};

export default App;
