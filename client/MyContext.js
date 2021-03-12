import React from 'react';

const defaultVal = {
    address: {},
    phoneNumber: {},
    cUSDBalance: {},
    forLog: {},
    helloWorldContract: {},
    contractName: {},
    textInput: {}
} //Insert the default value here.
export const MainContext = React.createContext({defaultVal, setAddress: () => {}});