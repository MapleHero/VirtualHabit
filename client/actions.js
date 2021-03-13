import {LOGIN} from './types';

function login(payload) {
    return {
        type : LOGIN, payload
    };
}

const actionCreators = {
    login
};

export {login};