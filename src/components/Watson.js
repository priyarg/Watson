import React from 'react';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import Expo, { Font } from "expo";
import {
  Container, Header, Content, Input, Item, Button, Text,
  Left, Right, Body, List, ListItem, Card, CardItem, Tab, Tabs, TabHeading, Spinner,
} from 'native-base';
import { tryAsk } from '../hasuraApi';
import TabScreen from './TabScreen'


export default class Watson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      sampleQuestion: '',
      jsonOutput: '',
      isReady: false,
      displayLabels: '',
      initialText: '',
      labelsArr: [],
      isLoading: false,
      isTab: false,
    }
    this.backToWatsonScreen = this.backToWatsonScreen.bind(this);
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }


  handleQuestionChange = sampleQuestion => {
    this.setState({
      ...this.state,
      sampleQuestion: sampleQuestion
    })
   
    this.state.sampleQuestion = sampleQuestion;
  }

  handleAskPressed = async () => {
    this.setState({
      isLoading: true
    });
    if (this.state.sampleQuestion == '') {
      this.setState({
        isLoading: false
      });
      Alert.alert("Enter Question")
    }
    else {
      console.log("Check sample question......: " + this.state.sampleQuestion);
      console.log("check user: " + this.state.username);
      let resp = await tryAsk(this.state.sampleQuestion, this.state.username);
      if (resp.status !== 200) {
        if (resp.status === 504) {
          this.setState({
            isLoading: false
          });
          Alert.alert("Network Error", "Check your internet connection")
        } else {
          this.setState({
            isLoading: false
          });
          Alert.alert("Error", "Unauthorized, Invalid sample question")
        }
      } else {
        //console.log("json respons......: " + resp);
        const myObjStr = JSON.stringify(resp);
        //console.log("Display keys......: " + myObjStr);
        this.setState({
          ...this.state,
          jsonOutput: myObjStr
        })

        console.log("Display parsed  keys......: " + JSON.parse(myObjStr));
        let response = JSON.parse(myObjStr);
       // console.log(response._bodyText);
        if (response._bodyText.includes("error: Error:")) {
          this.setState({
            isLoading: false
          });
          Alert.alert("Not enough text or wrong text provided for language detection")
        }
        else {
          let parse = JSON.parse(response._bodyText);
          var itemsLength = parse.categories.length;
          if (itemsLength === 0) {
            this.setState({
              isLoading: false
            });
            Alert.alert("No categories found")
          }
          else {
            console.log("itemsLength" + itemsLength);
            //added code to display labels
            var arr = Object.values(parse.categories);
            console.log("Disp......: " + arr.toString());
            var labels = [];
            let sc;
            parse.categories.forEach(function (lab) {
              sc = parseFloat(((lab.score) * 100).toFixed(2));
              labels.push('[' + sc + '%]   ' + lab.label);
            });
            console.log("Display labels......: " + labels.toString());
            this.state.displayLabels = labels.toString();
            this.state.initialText = "Natural Language Classifier is confident that the question submitted is related to ---";
            this.state.labelsArr = labels;
            console.log("Display labels this.state.labelsArr......: " + this.state.labelsArr);
            //setting for passing to other page
            this.setState({ ...this.state, isTab: true });
            this.setState({
              isLoading: false
            });
            // for same page refresh
            /* this.setState({
               ...this.state,
               labelsArr: (labels.toString()).split(",")
             });
             this.setState({
               ...this.state,
               initialText: "Natural Language Classifier is confident that the question submitted is related to ---"
             });
             this.setState({
               ...this.state,
               displayLabels: labels.toString()
             });*/

          }
        }
      }
    }
  }

  backToWatsonScreen() {
    this.setState({
      isTab: false
    })
  }


  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    if (this.state.isTab) {
      return (
        <TabScreen initialText={this.state.initialText}
          jsonOutput={this.state.jsonOutput} labelsArr={this.state.labelsArr} backToWatsonScreenCallback={this.backToWatsonScreen} />
      );
    }

    else {
      return (
        <Container>
          <Header />
          <Content>
            <Text style={{ paddingLeft: 20, paddingTop: 50, fontWeight: 'bold', fontSize: 25 }}> Watson Language classifier</Text>
            <Left style={{ paddingTop: 25 }} >
              <Item regular>
                <Input placeholder='Ask sample question.' value={this.state.sampleQuestion} onChangeText={this.handleQuestionChange} />
              </Item>
            </Left>
            <Right style={{ paddingTop: 15 }} >
              {
                this.state.isLoading ?
                  <Button disabled rounded onPress={this.handleAskPressed}>
                    <Text>Ask</Text>
                  </Button>
                  : <Button rounded onPress={this.handleAskPressed}>
                    <Text>Ask</Text>
                  </Button>
              }

              {
                this.state.isLoading ? <Spinner color='green' /> : null
              }

            </Right>
            {/*
          <Text style={{ paddingLeft: 20, paddingTop: 20, fontWeight: 'bold', fontSize: 25 }}>Output</Text>

          <Tabs style={{ backgroundColor: '#fff', paddingTop: 20 }} initialPage={0} tabBarUnderlineStyle={{ borderBottomWidth: 2 }}>
            <Tab style={{ backgroundColor: '#f0f8ff' }} heading={<TabHeading >
              <Text>Results</Text>
            </TabHeading>}>
              <Body>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                  {this.state.initialText}
                </Text>
                <Text>
                  {this.state.displayLabels}
                </Text>
              </Body>
            </Tab>
            <Tab style={{ backgroundColor: '#f0f8ff' }} heading={<TabHeading >
              <Text>JSON</Text>
            </TabHeading>}>
              <Body>
                <Text>
                  {this.state.jsonOutput}
                </Text>
              </Body>
            </Tab>
          </Tabs>

*/}
          </Content>
        </Container>
      );
    }//else close
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


