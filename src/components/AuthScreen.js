import React from 'react';
import { Container, Header, Title, Content, Button, Left, Body, Text, Form, Item, Label, Input, Right, Spinner } from 'native-base';
import { View, Alert } from 'react-native';
import { checkUser } from '../hasuraApi';
import Watson from './Watson';


export default class AuthScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      usernameTextBox: '',
      //	passwordTextBox : '',
      loading: true,
      isLoading: false,
      //visible: false, 
      fontsAreLoaded: false,
    }
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({ ...this.state, fontsAreLoaded: true });

  }

  handleLoginPressed = async () => {
    // Set loading to true when the search starts to display a Spinner
    this.setState({
      isLoading: true
    });
    if (this.state.usernameTextBox === "") {
      this.setState({
        isLoading: false
      });
      Alert.alert("Enter username")
    } else {     
      let respUser = await checkUser();
      this.setState({
        loading: false
      });

      // loading: false;  
      console.log("check response------------------" + respUser.status);
      if (respUser.status !== 200) {
        if (respUser.status === 504) {
          Alert.alert("Network Error", "Check your internet connection")
        } else {
          Alert.alert("Error", "Unauthorized, Invalid username")
        }
      } else {
        console.log("json respons......: " + respUser);
        let parsedObj = JSON.parse(respUser._bodyInit);
        console.log("parsedObj......: " + parsedObj);
        var users = [];
        // arr.forEach(function (categories) { //code for checking higher level parsed object
        parsedObj.forEach(function (user) {
          users.push(user.user_hash);
        });
        //}
        //);
        console.log("Display users......: " + users.toString());
        let username = this.state.usernameTextBox;
        // check if entered input is present in users array
        var a = users.indexOf(username);
        console.log("check a......: " + a);
        this.setState({
          isLoading: false
        });
        if (a !== -1) {
          this.setState({ isLoggedIn: true })
        }
        else {
          Alert.alert("Enter username:sam/gaurav/karthikeya")
        }
      }
    }
  }

  /*handleSignupPressed = async () => {
    let resp = await trySignup(this.state.usernameTextBox, this.state.passwordTextBox);
    if(resp.status !== 200){
      if (resp.status === 504) {
        Alert.alert("Network Error", "Check your internet connection" )
      } else {
        Alert.alert("Error", "Password too short / User already exists")      
      }
    } else {
      this.setState({isLoggedIn:true})  
    }
  }*/

  handleUsernameChange = usernameTextBox => {
    this.setState({
      ...this.state,
      usernameTextBox: usernameTextBox
    })
  }

  /*handlePasswordChange = passwordTextBox => {
  	this.setState({
  		...this.state,
  		passwordTextBox: passwordTextBox
  	})
  }

  handleLogout = () => {
    this.setState({
      ...this.state,
      isLoggedIn: false
    })
  }*/

  render() {
    if (this.state.fontsAreLoaded == true) {
      if (this.state.isLoggedIn === true) {
        return (
          <Watson username={this.state.usernameTextBox} />
        );
      }

      return (

        <Container>
          <Header>
            <Left />
            <Body>
              <Title> Login </Title>
            </Body>
            <Right />
          </Header>
          <Content contentContainerStyle={{ justifyContent: 'center', margin: 20 }}>
            <Form>
              <Item floatingLabel>
                <Label>Username</Label>
                <Input value={this.state.usernameTextBox} onChangeText={this.handleUsernameChange} />
              </Item>
              {/*  
              <Item floatingLabel>
                <Label>Password</Label>
                <Input value={this.state.passwordTextbox} onChangeText={this.handlePasswordChange} secureTextEntry/>
              </Item>*/}
            </Form>
            {/* <View style = {{height:10}} />
            <Button block onPress={this.handleSignupPressed} >
              <Text> Sign up </Text>
            </Button>*/}
            <View style={{ height: 10 }} />
            {
              this.state.isLoading ?
                <Button disabled block title="Log in" onPress={this.handleLoginPressed} >
                  <Text> Log in </Text>
                </Button>
                : <Button block title="Log in" onPress={this.handleLoginPressed} >
                  <Text> Log in </Text>
                </Button>
            }

            {
              this.state.isLoading ? <Spinner color='green' /> : null
            }
          </Content>
        </Container>
      )
    }
    return (
      <Container>
        <Header />
        <Content>
          <Spinner color='black' />
        </Content>
      </Container>
    );
  }
}
