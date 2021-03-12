import React from 'react'
import './global'
import { web3, kit } from './root'
import { Image, StyleSheet, Text, TextInput, Button, View, YellowBox } from 'react-native'
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
import  {MainContext} from "./MyContext"

YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream'])

// set up ContractKit, using forno as a provider
// testnet



export default class CreateBounty extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            address: 'test',
            phoneNumber: null,
            cUSDBalance: null,
            forLog: null,
            helloWorldContract: 'test',
            contractName: '',
            textInput: ''
          };
        console.log("super done");
 
    }
  
static contextType = MainContext;

  // Set the defaults for the state



  // This function is called when the page successfully renders
  componentDidMount  ()  {

    const context = this.context;
    //It will get the data from context 
    this.setState({address: context.address});

    console.log('ran at 11.17');
    console.log(context);

    console.log('test');
  }



  

  




  render(){
    const value = this.state;
    return (
      <View style={styles.container}>
        
        <Text>For Logsdsdsdfdfdsdsd: {value.address}</Text>
        
      </View>
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