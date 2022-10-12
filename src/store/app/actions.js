import {LOCAL_STORAGE} from '../../config';

const {APP} = require("../actions_type").default;

export function init() {
    return (dispatch, getState) => {
        let login_info = window.sessionStorage.getItem(LOCAL_STORAGE.LOGIN_INFO);
        if (login_info) {
            try {
                login_info = JSON.parse(login_info);
                dispatch({
                    type: APP.SET_LOGIN,
                    data: login_info
                })
            } catch (err) {
            }
        } else {
            if (window.location.hostname === 'localhost') {
                // dispatch({
                //   type: APP.SET_LOGIN,
                //   data: login_info || {token: "123", username: 'avi'}
                // })
            }
        }
        let donate_info = window.sessionStorage.getItem(LOCAL_STORAGE.DONATE_INFO);
        if (donate_info) {
            try {
                donate_info = JSON.parse(donate_info);
                dispatch({
                    type: APP.UPDATE_DONATE,
                    data: donate_info
                })
            } catch (err) {
            }
        }
        let book_info = window.sessionStorage.getItem(LOCAL_STORAGE.BOOK_INFO);
        if (book_info) {
            try {
                book_info = JSON.parse(book_info);
                dispatch({
                    type: APP.SET_SELECTED_BOOK,
                    data: book_info
                })
            } catch (err) {
            }
        }
        let verses_info = window.sessionStorage.getItem(LOCAL_STORAGE.VERSES_INFO);
        if (verses_info) {
            try {
                verses_info = JSON.parse(verses_info);
                dispatch({
                    type: APP.SET_SELECTED_VERSES,
                    data: verses_info
                })
            } catch (err) {
            }
        }
    }
}

export function setMobileView(isMobile) {
    return (dispatch, getState) => {
        dispatch({
            type: APP.SET_MOBILE_VIEW,
            data: {mobileView: isMobile}
        })
    }
}

export function login(data) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            window.sessionStorage.setItem(LOCAL_STORAGE.LOGIN_INFO, JSON.stringify(data));
            dispatch({
                type: APP.SET_LOGIN,
                data: data
            })
            resolve();
        })
    }
}

export function updateDonate(data) {
    return (dispatch, getState) => {
        window.sessionStorage.setItem(LOCAL_STORAGE.DONATE_INFO, JSON.stringify(data));
        dispatch({
            type: APP.UPDATE_DONATE,
            data: data
        })
    }
}

export function resetAppData() {
    return (dispatch, getState) => {
        window.sessionStorage.removeItem(LOCAL_STORAGE.DONATE_INFO);
        window.sessionStorage.removeItem(LOCAL_STORAGE.BOOK_INFO);
        window.sessionStorage.removeItem(LOCAL_STORAGE.VERSES_INFO);
        dispatch({
            type: APP.CLEAR_ALL,
            data: {},
        });
    }
}

export function logout() {
    return (dispatch, getState) => {
        window.sessionStorage.removeItem(LOCAL_STORAGE.LOGIN_INFO);
        dispatch({
            type: APP.LOGOUT,
            data: null
        })
    }
}


export function updateModal(data) {
    return (dispatch, getState) => {
        dispatch({
            type: APP.UPDATE_MODAL,
            data: data
        })
    }
}


export function resetModal() {
    return (dispatch, getState) => {
        console.log('reset modal');
        dispatch({
            type: APP.RESET_MODAL,
            data: null
        })
    }
}


export function updateFooter(data) {
  return (dispatch, getState) => {
    dispatch({
      type: APP.UPDATE_FOOTER,
      data: data
    })
  }
}


export function setSelectedVerses(data) {
    return (dispatch, getState) => {
        window.sessionStorage.setItem(LOCAL_STORAGE.VERSES_INFO, JSON.stringify(data));
        dispatch({
            type: APP.SET_SELECTED_VERSES,
            data: data
        })
    }
}

export function setBlessFor(data) {
    return (dispatch, getState) => {
        dispatch({
            type: APP.SET_BLESS_FOR,
            data: data
        })
    }
}

export function setSelectedBook(data) {
    return (dispatch, getState) => {
        window.sessionStorage.setItem(LOCAL_STORAGE.BOOK_INFO, JSON.stringify(data));
        dispatch({
            type: APP.SET_SELECTED_BOOK,
            data: data
        })
    }
}

export function setPayment(data) {
    return (dispatch, getState) => {
        dispatch({
            type: APP.SET_PAYMENT,
            data: data
        })
    }
}

export function clearAll(data) {
    return (dispatch, getState) => {
        dispatch({
            type: APP.CLEAR_ALL,
            data: data
        })
    }
}
