import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  AsyncStorage,
  Button,
  TextInput
} from "react-native";

export default class AddAllergy extends Component {
  state = {
    tasks: [],
    text: "",
    strTask:""
  };

  changeTextHandler = text => {
    this.setState({ text: text });
  };

   addPropStrTask = () => {
    var res = "";
    for(var i = 0; i < this.state.tasks.length; i++) {
        res += this.state.tasks[i].text;
        if(i != this.state.tasks.length-1) {
            res += ",";
        }
    }
    res += ","+this.state.text;
    this.setState({
        strTask: res
    });
    fetch(`http://10.33.141.72:42069/updRestrictions/${res}`)
        .then((response) => response.json())
        .then((responseJson) =>{
          this.setState({
          }, function(){
          })
        })
  }

  deletePropStrTask = (j) => {
    var res = "";
    for(var i = 0; i < this.state.tasks.length; i++) {
        res += this.state.tasks[i].text;
        if(i != this.state.tasks.length-1) {
            res += ",";
        }
    }
    res = res.split(","+this.state.tasks[j].text).join("");
    console.log(res);
    this.setState({
        strTask: res
    });
    fetch(`http://10.33.141.72:42069/updRestrictions/${res}`)
        .then((response) => response.json())
        .then((responseJson) =>{
          this.setState({
          }, function(){
          })
        })
  }

  addTask = () => {
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      this.setState(
        prevState => {
          let { tasks, text } = prevState;
          return {
            tasks: tasks.concat({ 
                key: tasks.length, 
                text: text }),
            text: ""
          };
        },
        () => Tasks.save(this.state.tasks)
      );
    }
    this.addPropStrTask();
  };

  deleteTask = i => {
    this.setState(
      prevState => {
        let tasks = prevState.tasks.slice();
        tasks.splice(i, 1);
        return { tasks: tasks };
      },
      () => Tasks.save(this.state.tasks)
    );
    this.deletePropStrTask(i);
    //console.log(this.state.strTask);
  };

  componentDidMount() {
    Tasks.all(tasks => {
        this.setState({ tasks: tasks || [] });
    });
  }

  render() {
    return (
      <View
        style={styles.container}
      >
          <TextInput
          style={styles.textInput}
          onChangeText={this.changeTextHandler}
          onSubmitEditing={this.addTask}
          value={this.state.text}
          placeholder="Add Restriction"
          returnKeyType="done"
          returnKeyLabel="done"
        />
        <FlatList
          style={styles.list}
          data={this.state.tasks}
          renderItem={({ item, index }) =>
            <View>
              <View style={styles.listItemCont}>
                <Text style={styles.listItem}>
                  {item.text}
                </Text>
                <Button title="X" onPress={() => this.deleteTask(index)} />
              </View>
              <View style={styles.hr} />
            </View>}
        />
      </View>
    );
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30
  },
  listItem: {
    fontSize: 18
  },
  hr: {
    height: 1,
  },
  listItemCont: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textInput: {
      paddingTop: 30,
      paddingBottom: 10,
      borderBottomWidth: 2,
      borderBottomColor: "#60B0F4"
  }
});