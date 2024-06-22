import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StickyNoteScreen from './../../App';
import BookListScreen from '../screens/BookList';
import BookmarkScreen from '../screens/Bookmark';
import Icon from 'react-native-vector-icons/FontAwesome';
const Tab = createBottomTabNavigator();

const AppTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Bookmark') {
            iconName = 'bookmark';
          } else if (route.name === 'DogEar') {
            iconName = 'book';
          } else if (route.name === 'StickyNote') {
            iconName = 'sticky-note';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="StickyNote" component={StickyNoteScreen} />
      <Tab.Screen
        name="BookList"
        component={BookListScreen}
        options={{tabBarButton: () => null}}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
