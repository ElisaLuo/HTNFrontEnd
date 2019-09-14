import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';

import FoodCamera from './components/FoodCamera';
import AddAllergy from './components/AddAllergy';

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
      drawerLabel: "Add Your Allergy"
    }
  }
});

export default createAppContainer(MyDrawerNavigator);