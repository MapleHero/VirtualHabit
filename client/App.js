import React from 'react'
import './global'
import { web3, kit } from './root'
import { Image, StyleSheet, Text, TextInput, Button, View, LogBox } from 'react-native'
import {
  requestTxSig,
  waitForSignedTxs,
  requestAccountAddress,
  waitForAccountAuth,
  FeeCurrency
} from '@celo/dappkit'
import { toTxResult } from "@celo/connect"
import * as Linking from 'expo-linking'
import HelloWorldContract from './contracts/HelloWorld.json'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import GiftScreen from "./Gift.js";
import Login from "./Login.js";
import CreateBounty from "./CreateBounty.js"
LogBox.ignoreLogs(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream'])
import reducer from './reducers';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
// set up ContractKit, using forno as a provider
// testnet

const Drawer = createDrawerNavigator();
const store = createStore(reducer);
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

    </View>
  );
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state={ 
      address:"not_logged_in"
    }
  }

  setAddress=(address_passed_in)=>{
    console.log("in App " + address_passed_in);

    this.setState({address:address_passed_in});
  }

  // This function is called when the page successfully renders
  componentDidMount = async () => {


  }

  onChangeText = async (text) => {
    this.setState({textInput: text})
  }

   HomeScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      </View>
    );
  }
  

  
   NotificationsScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => navigation.goBack()} title="Go back home" />
      </View>
    );
  }
  


  render(){
    return (
      <Provider store={store}>
      <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Login" component={Login} options={{}}/>
        <Drawer.Screen name="Give Gift" component={GiftScreen} />
        <Drawer.Screen name="Create bounty" component={CreateBounty} />
      </Drawer.Navigator>
    </NavigationContainer>
    </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#35d07f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginVertical: 8,
    fontSize: 20,
    fontWeight: 'bold'
  }
});
