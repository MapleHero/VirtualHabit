import React, {Component} from 'react'
import {connect} from "react-redux";

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


LogBox.ignoreLogs(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream'])

// set up ContractKit, using forno as a provider
// testnet

const mapStateToProps = state => { 
  return {  address  : state.address };
}

class GiftScreen extends Component {
  componentWillReceiveProps(nextProps) {
    const currentProps = this.props;
    //console.log('current props')
    //console.log(currentProps);
  }

  // This function is called when the page successfully renders
  componentDidMount = async () => {
    // Check the Celo network ID
    const networkId = await web3.eth.net.getId();

    // Wait for the Celo Wallet response
    const dappkitResponse = await waitForAccountAuth(requestId)
    //console.log('component did mount');
    //console.log(currentProps);
  }

  sendMoney = async () => {
    console.log("sendMonay")
    console.log(this.props.address);

    this.transfer()
  }

  transfer = async () => {
    if (this.props.address) {

     kit.defaultAccount = this.props.address;


      console.log("Entering transfer")
      const requestId = 'transfer';
      const dappName = 'Hello Celo';

      // Replace with your own account address and desired value in WEI to transfer
      const transferToAccount = "0xD86518b29BB52a5DAC5991eACf09481CE4B0710d";
      const transferValue = "10000000000";

      // Create a transaction object using ContractKit
      const stableToken = await kit.contracts.getStableToken();
      const txObject = stableToken.transfer(transferToAccount, transferValue).txo;
      const callback = Linking.makeUrl('/my/path')
      // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
      requestTxSig(
        kit,
        [
          {
            // @ts-ignore
            tx: txObject,
            from: this.props.address,
            to: stableToken.address,
            feeCurrency: FeeCurrency.cUSD
          }
        ],
        { requestId, dappName, callback}
      )
      // Get the response from the Celo wallet
      // Wait for signed transaction object and handle possible timeout
      let tx;
      try {
    
        console.log("Star transfer")
        const dappkitResponse = await waitForSignedTxs(requestId)
                console.log("Done transfer")
        tx = dappkitResponse.rawTxs[0]
      } catch (error) {
        console.log(error)
        return
      }

      // Wait for transaction result and check for success
      let status;
      const result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()
      if (result.status) {
        status = "transfer succeeded with receipt: " + result.transactionHash;
      } else {
        console.log(JSON.stringify(result))
        status = "failed to send transaction"
      }

    // Get the user account balance (cUSD)
    const cUSDBalanceBig = await stableToken.balanceOf(kit.defaultAccount)

    // Convert from a big number to a string
    let cUSDBalance = cUSDBalanceBig.toString()

    console.log("current balance is after transfer " + cUSDBalance)

    }
  }

  login = async () => {

    // A string you can pass to DAppKit, that you can use to listen to the response for that request
    const requestId = 'login'

    // A string that will be displayed to the user, indicating the DApp requesting access/signature
    const dappName = 'Hello Celo'

    // The deeplink that the Celo Wallet will use to redirect the user back to the DApp with the appropriate payload.
    const callback = Linking.makeUrl('/my/path')

    // Ask the Celo Alfajores Wallet for user info
    requestAccountAddress({
      requestId,
      dappName,
      callback,
    })

    // Wait for the Celo Wallet response
    const dappkitResponse = await waitForAccountAuth(requestId)

    // Set the default account to the account returned from the wallet
    kit.defaultAccount = dappkitResponse.address

    // Get the stabel token contract
    const stableToken = await kit.contracts.getStableToken()

    // Get the user account balance (cUSD)
    const cUSDBalanceBig = await stableToken.balanceOf(kit.defaultAccount)

    // Convert from a big number to a string
    let cUSDBalance = cUSDBalanceBig.toString()

    console.log("current balance is " + cUSDBalance)

    // Update state
   /* this.setState({ cUSDBalance,
                    isLoadingBalance: false,
                    address: dappkitResponse.address,
                    phoneNumber: dappkitResponse.phoneNumber })*/
  }

  onChangeText = async (text) => {
    this.setState({textInput: text})
  }

  render(){
    const {
      address
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login first</Text>
        <Button title="login()"
          onPress={()=> this.login()} />
                <Text style={styles.title}>Account Info:</Text>
        <Button title="Send Money"
          onPress={()=> this.sendMoney()} />
        <Text>Current Account Address:</Text>
        <Text>{this.props.address}</Text>
      </View>
    );
  }
}

const GiftScreenImpl = connect(mapStateToProps)(GiftScreen);

export default GiftScreenImpl;

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