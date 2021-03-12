import {LOGIN} from './types';

function login() {
    return {
        type : LOGIN
    };
}

const actionCreators = {
    login
};

export {login};