import {LOGIN} from './types';

const initialState = {
    address: 'Not_Logged_In_from reducer'
};

function setAddress(state) {
    //console.log('set address in reducer  ' + state);
    //console.log('===================');
    //console.log('set address', state.toPass.address);
    //console.log('===================');
    return {
        address: state.address
        };
}

// Reducer Function
function reducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN: 
            /*console.log('state ')
            console.log(state);
            console.log("====================");
            console.log('action', action);*/
            console.log('===================');
            console.log('action payload', action.payload);
            console.log('===================');
            return setAddress(action.payload);
        default: 
            return state; 
    }
}

export default reducer;