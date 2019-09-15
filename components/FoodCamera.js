import * as React from 'react';
import { Button, Image, View, FlatList, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { TouchableHighlight } from 'react-native-gesture-handler';

export default class FoodCamera extends React.Component {
  state = {
    image: null,
    response: null,
    uploading: false,
    baseImage: null,
    allergies: "",
    results: {}
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        <Button onPress={this._takePhoto} title="Take a photo" />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <Button onPress={this._submitToGoogle} title="Get Name" />
        {
          Object.keys(this.state.results).map((food, val) => {
            console.log(food + " " + val);
            console.log(this.state.results[food]);
            return(
              <Text> {food} confidence value - {this.state.results[food]*100}% </Text>
            )
          })
        }
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { RollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const { CameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
      if (RollStatus !== 'granted' && CameraStatus !== 'granted') {
        //alert('Sorry, we need camera roll and camera permissions to make this work!');
      }
    }
  }

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });
    console.log(this.state.allergies);
    const base64 = await FileSystem.readAsStringAsync(pickerResult.uri,{encoding:'base64'});
    this.setState({baseImage: base64})

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      if (!pickerResult.cancelled) {
        this.setState({ image: pickerResult.uri });
      }
    } catch (e) {
      //alert(e);
      alert("Upload failed, sorry :(");
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });
    //alert(result.uri);
    const base64 = await FileSystem.readAsStringAsync(result.uri,{encoding:'base64'});
    this.setState({baseImage: base64})

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  _submitToGoogle = async () => {
    try{
        this.setState({uploading: true});
        let{baseImage} = this.state;
        //alert(baseImage);
        let body= JSON.stringify({
            requests:[
                {
                    features:[
                        {type:"WEB_DETECTION", maxResults: 1}
                    ],
                    image:{
                        content: baseImage
                    }
                }
            ]
        });
        let response = await fetch("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBNb4583aq9ao490jJ6rKYjeL7QHNLEl0Y",{
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: body
        });
        let responseJson = await response.json();
        //alert();
        this.setState({
            uploading: false,
            response: responseJson.responses[0].webDetection.webEntities[0].description
        });
        console.log(this.state.response);
        console.log(this.state.allergies);
        fetch(`http://10.33.141.72:42069/${this.state.response}`)
        .then((response) => response.json())
        .then((responseJson) =>{
          this.setState({
            results: responseJson //{Apple: 0, Orange: 0.04, Peanuts: 0, Potato: 0.02}
          }, function(){
            console.log(this.state.results)
          })
        })
        .catch(err=>{
          alert("fetch" + err);
        })
    } catch(error){
        alert("eeor" +error);
    }
  }
}