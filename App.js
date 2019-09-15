import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer, } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {Icon} from "native-base"

import FoodCamera from './components/FoodCamera';
import AddAllergy from './components/AddAllergy';

const foodCamera = createStackNavigator({
  Food_Camera: {
    screen: FoodCamera,
    navigationOptions:()=>({
      headerTitle:(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
          <Text style={{color:"white", fontSize: 20, fontWeight: 500}}>AllerVision</Text>
        </View>
      ),
      headerLeft: <Icon name='menu' style={{color: "white", paddingLeft: 20}}></Icon>
    })
  }
},{
  initialRouteName: 'Food_Camera',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#60B0F4',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0
      },
    }, 
})

const allAllergy = createStackNavigator({
  all_Allergy:{
    screen: AddAllergy,
    navigationOptions:()=>({
      headerTitle:(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
          <Text style={{color:"white", fontSize: 20, fontWeight: 500}}>Restrictions</Text>
        </View>
      ),
      headerLeft: <Icon name='menu' style={{color: "white", paddingLeft: 20}}></Icon>
    }) 
  }
},{
  initialRouteName: 'all_Allergy',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#60B0F4',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0
      }
    }, 
})

const CameraContainer = createAppContainer(foodCamera);
const AllergyContainer = createAppContainer(allAllergy);

const MyDrawerNavigator = createDrawerNavigator({
  CameraFood: {
    screen: CameraContainer,
    navigationOptions:{
      drawerLabel: "Camera"
    }
  },
  AddAllergy: {
    screen: AllergyContainer,
    navigationOptions:{
      drawerLabel: "Add Restriction"
    }
  },
  Login:{
    screen:AllergyContainer,
    navigationOptions:{
      drawerLabel: "Log In"
    }
  }
},{
  initialRouteName: "CameraFood"
});

const Side = createAppContainer(MyDrawerNavigator);
export default class App extends React.Component{
  render(){
    return(
      <Side />
    )
  }
}