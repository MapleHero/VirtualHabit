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


LogBox.ignoreLogs(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream'])

// set up ContractKit, using forno as a provider
// testnet

export default class GiftScreen extends React.Component {

  // Set the defaults for the state
  state = {
    address: 'Not logged in',
    phoneNumber: 'Not logged in',
    cUSDBalance: 'Not logged in',
  }
  //this.props.navigation.getParam(paramName, defaultValue)
  // This function is called when the page successfully renders
  componentDidMount = async () => {
    // Check the Celo network ID
    const networkId = await web3.eth.net.getId();
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
    this.setState({ cUSDBalance,
                    isLoadingBalance: false,
                    address: dappkitResponse.address,
                    phoneNumber: dappkitResponse.phoneNumber })

    this.props.functionCallFromParent(dappkitResponse.address);
  }

  onChangeText = async (text) => {
    this.setState({textInput: text})
  }

  render(){
    const { userName } = this.props.navigation.state.params;
    console.log(userName)

    return (
 

      <View style={styles.container}>
        <Text style={styles.title}>Login first</Text>
        <Button title="login()"
          onPress={()=> this.login()} />
                <Text style={styles.title}>Account Info:</Text>
        <Text>Current Account Address:</Text>
        <Text>{this.state.address}</Text>
        <Text>Phone number: {this.state.phoneNumber}</Text>
        <Text>cUSD Balance: {this.state.cUSDBalance}</Text>
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