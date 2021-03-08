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


YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream'])

// set up ContractKit, using forno as a provider
// testnet

export default class GiftScreen extends React.Component {

  // Set the defaults for the state
  state = {
    address: 'Not logged in',
    phoneNumber: 'Not logged in',
    cUSDBalance: 'Not logged in',
    forLog: 'not defined??',
    helloWorldContract: {},
    contractName: '',
    textInput: ''
  }

  // This function is called when the page successfully renders
  componentDidMount = async () => {

    // Check the Celo network ID
    const networkId = await web3.eth.net.getId();

    // Get the deployed HelloWorld contract info for the appropriate network ID
    const deployedNetwork = HelloWorldContract.networks[networkId];

    // Create a new contract instance with the HelloWorld contract info
    const instance = new web3.eth.Contract(
      HelloWorldContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    // Save the contract instance
    this.setState({ helloWorldContract: instance })
  }

  sendMoney = async () => {

    // Update state
    this.setState({ forLog: 'dappkitResponse.phoneNumber' })


    this.transfer()

  }

  transfer = async () => {
    if (this.state.address) {
      console.log("Entering transfer")
      const requestId = 'transfer';
      const dappName = 'Hello Celo';

      // Replace with your own account address and desired value in WEI to transfer
      const transferToAccount = "0xD86518b29BB52a5DAC5991eACf09481CE4B0710d";
      const transferValue = "1";

      // Create a transaction object using ContractKit
      const stableToken = await kit.contracts.getStableToken();
      const txObject = stableToken.transfer(transferToAccount, transferValue).txo;
    const callback = Linking.makeUrl('/my/path')
      this.setState({forLog: 'duh'})
      // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
      requestTxSig(
        kit,
        [
          {
            // @ts-ignore
            tx: txObject,
            from: this.state.address,
            to: stableToken.address,
            feeCurrency: FeeCurrency.cUSD
          }
        ],
        { requestId, dappName, callback}
      )
      this.setState({forLog: 'bloop'})
      // Get the response from the Celo wallet
      // Wait for signed transaction object and handle possible timeout
      let tx;
      try {
        this.setState({forLog: "start TsssX"})
        console.log("Star transfer")
        const dappkitResponse = await waitForSignedTxs(requestId)
                console.log("Done transfer")
        this.setState({forLog: "done response TX"})
        tx = dappkitResponse.rawTxs[0]
      } catch (error) {
        console.log(error)
        this.setState({forLog: "transaction signing timed out, try again."})
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
      this.setState({forLog: 'log'})

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

    // Update state
    this.setState({ cUSDBalance,
                    isLoadingBalance: false,
                    address: dappkitResponse.address,
                    phoneNumber: dappkitResponse.phoneNumber })
  }

  read = async () => {

    // Read the name stored in the HelloWorld contract
    let name = await this.state.helloWorldContract.methods.getName().call()

    // Update state
    this.setState({ contractName: name })
  }

  write = async () => {
    const requestId = 'update_name'
    const dappName = 'Hello Celo'
    const callback = Linking.makeUrl('/my/path')

    // Create a transaction object to update the contract with the 'textInput'
    const txObject = await this.state.helloWorldContract.methods.setName(this.state.textInput)

    // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
    requestTxSig(
      kit,
      [
        {
          from: this.state.address,
          to: this.state.helloWorldContract.options.address,
          tx: txObject,
          feeCurrency: FeeCurrency.cUSD
        }
      ],
      { requestId, dappName, callback }
    )

    // Get the response from the Celo wallet
    const dappkitResponse = await waitForSignedTxs(requestId)
    const tx = dappkitResponse.rawTxs[0]

    // Get the transaction result, once it has been included in the Celo blockchain
    let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()

    console.log(`Hello World contract update transaction receipt: `, result)
  }

  onChangeText = async (text) => {
    this.setState({textInput: text})
  }

  render(){
    return (
      <View style={styles.container}>
        <Image resizeMode='contain' source={require("./assets/white-wallet-rings.png")}></Image>
        <Text>Open up client/App.js to start working on your app!</Text>

        <Text style={styles.title}>Login first</Text>
        <Button title="login()"
          onPress={()=> this.login()} />
                <Text style={styles.title}>Account Info:</Text>
       <Button title="Send Money"
          onPress={()=> this.sendMoney()} />
        <Text>For Log: {this.state.forLog}</Text>
        <Text>Current Account Address:</Text>
        <Text>{this.state.address}</Text>
        <Text>Phone number: {this.state.phoneNumber}</Text>
        <Text>cUSD Balance: {this.state.cUSDBalance}</Text>

        <Text style={styles.title}>Read HelloWorld</Text>
        <Button title="Read Contract Name"
          onPress={()=> this.read()} />
        <Text>Contract Name: {this.state.contractName}</Text>

        <Text style={styles.title}>Write to HelloWorld</Text>
        <Text>New contract name:</Text>
        <TextInput
          style={{  borderColor: 'black', borderWidth: 1, backgroundColor: 'white' }}
          placeholder="input new name here"
          onChangeText={text => this.onChangeText(text)}
          value={this.state.textInput}
          />
        <Button style={{padding: 30}} title="update contract name"
          onPress={()=> this.write()} />
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