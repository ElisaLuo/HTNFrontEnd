import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';

import FoodCamera from './components/FoodCamera';
import AddAllergy from './components/AddAllergy';
/* 
const Food_Camera = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  First: {
    screen: FoodCamera,
    navigationOptions: ({ navigation }) => ({
      title: 'AllerVision',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});
 */
const MyDrawerNavigator = createDrawerNavigator({
  FoodCamera: {
    screen: FoodCamera,
    navigationOptions:{
      drawerLabel: "Camera"
    }
  },
  AddAllergy: {
    screen: AddAllergy,
    navigationOptions:{
      drawerLabel: "Add Allergy"
    }
  }
});

export default createAppContainer(MyDrawerNavigator);