import * as React from 'react';
import { Image, View, FlatList, Text, Item } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Button, Icon } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
export default class FoodCamera extends React.Component {
  state = {
    image: null,
    response: null,
    uploading: false,
    baseImage: null,
    allergies: "",
    results: {},
    loading: false
  };

  render() {
    let { image } = this.state;

    return (
      
      <View style={{ flex: 1, flexDirection: 'row', textAlign: 'center', justifyContent: 'center'}}>
        <Spinner visible={this.state.loading} />
        {image &&
          <Image source={{ uri: image }} style={{ width: 375, height: 375, position: 'relative', top: 0, left:0}} />}
        {
          Object.keys(this.state.results).map((food, val) => {
            console.log(food + " " + val);
            console.log(this.state.results[food]);
            var count = 375+val*20;
            return(
              <Text style={{position: 'absolute', top: count, textAlign: 'center', fontSize: 15}}> {food} confidence value - {this.state.results[food]*100}%</Text>
            )
          })
        }
        <Button style={{width: 125, height: 60, borderRadius: 0, borderWidth: 0, alignItems: 'center', position:'absolute', bottom: 0, left: 0}} onPress={this._pickImage} info><Icon name="add-circle" style={{marginLeft: 58}}/></Button>
          <Button style={{width: 125, height: 60, borderRadius: 0, borderWidth: 0, alignItems: 'center', position:'absolute', bottom: 0, left: 125}} onPress={this._submitToGoogle} info><Icon name="nutrition" style={{marginLeft: 58}}/></Button>
          <Button style={{flex: 1, width: 125, height: 60, borderRadius: 0, borderWidth: 0, alignItems: 'center', position:'absolute', bottom: 0, left: 250}} onPress={this._takePhoto} info><Icon name="camera" style={{marginLeft: 58}}/></Button>
        
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
        this.setState({uploading: true, loading: true});
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
            console.log(this.state.results);
            this.setState({loading: false})
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

/* const styles = StyleSheet.create({
  button: {
    backgroundColor: '#60B0F4',
    width: 125,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 12,
    textAlign:'center',
  }
}); */

/* <Container>
        <Header />
        <Content>
          <Button onPress={this._pickImage} info><Icon name="add-circle"/></Button>
          <Button onPress={this._submitToGoogle} info><Text>Find </Text></Button>
          <Button onPress={this._takePhoto} info><Text>+ </Text></Button>
        {image &&
          <Image source={{ uri: image }} />}
        {
          Object.keys(this.state.results).map((food, val) => {
            console.log(food + " " + val);
            console.log(this.state.results[food]);
            return(
              <Text> {food} confidence value - {this.state.results[food]*100}% </Text>
            )
          })
        }
        </Content>
      </Container> */