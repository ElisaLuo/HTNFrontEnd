import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class AddAllergy extends React.Component {
  render(){
      return(
        <View>
            <Text style={styles.text}>Open up App.js to start working on your app!</Text>
        </View>
      )
  }
}
const styles = StyleSheet.create({
    text:{
        fontSize: 30
    }
  });