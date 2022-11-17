const {APP} = require("../actions_type").default;
const initialState = require('./initial').default;

export default function appReducer(state = initialState, action) {
    let newState = {...state}
    switch (action.type) {
        case APP.SET_LOGIN: {
            newState.token = action.data.token;
            break;
        }

        case APP.UPDATE_DONATE: {
            newState.donate = action.data;
            break;
        }

        case APP.LOGOUT: {
            newState.token = '';
            break;
        }

        case APP.SET_MOBILE_VIEW: {
            newState.mobileView = action.data.mobileView;
            break;
        }

        case APP.UPDATE_MODAL: {
            newState.modal = action.data;
            break;
        }

        case APP.RESET_MODAL: {
            newState.modal = null;
            break;
        }

        case APP.UPDATE_FOOTER: {
            newState.footer = action.data;
            break;
        }

        case APP.SET_SELECTED_VERSES: {
            newState.selectedVerses = action.data;
            break;
        }

        case APP.ADD_TO_CART: {
            newState.cart = action.data;
            break;
        }

        case APP.SET_BLESS_FOR: {
            newState.blessFor = action.data;
            break;
        }
        case APP.SET_SELECTED_BOOK: {
            newState.selectedBook = action.data;
            break;
        }

        case APP.SET_PAYMENT: {
            newState.payment = action.data;
            break;
        }

        case APP.CLEAR_ALL: {
            newState = {...initialState};
            break;
        }

        default:
            return newState;
    }

    return newState
}
