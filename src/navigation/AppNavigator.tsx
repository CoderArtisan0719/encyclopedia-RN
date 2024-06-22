// src/navigation/AppNavigator.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BookDetail from '../screens/BookContent';
import AppTabs from './AppTabs';
import {RootStackParamList} from './RootStackParamList';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={AppTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetail}
          options={{headerBackTitleVisible: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
