import rp from 'request-promise';
import axios from 'axios';
import moment from "moment";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
const actions = require('./store/app/actions');
const store = require('./store').default;
const DOMAIN = window.DOMAIN;


async function loadFingerPrint() {
    return FingerprintJS.load()
        .then(fp => fp.get())
        .then(result => {
            // This is the visitor identifier:
            window.visitorId = result.visitorId;
            return result.visitorId;
        });
}

const headers = {}
// let headers = new Headers();
headers['Access-Control-Allow-Origin'] = DOMAIN;
// headers['visitor-id'] = window.visitorId;

function responseMiddleware(response) {
    return response;
}

function logoutMiddleware(error) {
    if (error.response.status === 501) {
        actions.logout();
        window.location = '/login';
    }
    throw error;
}

function catchMiddleware(response) {
    throw response;
}


export const getToken = () => {
    return axios.CancelToken.source();
}

const REST = {
    fakeLogin: () => {
        return new Promise((resolve, reject) => {
            resolve({token: "abc"});
        })
    },
    login: (data) => {
        return axios.post(`${DOMAIN}/common/login`, data,
            {
                headers: {...headers},
            })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
            .catch(catchMiddleware)
    },
    getAllBooks: () => {
        return axios.get(`${DOMAIN}/book`, {
            json: true,
            headers: {...headers}
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    },
    getBooksByCategory: (category) => {
        return axios.get(`${DOMAIN}/book?category=${category}`, {
            json: true,
            headers: {...headers}
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    },
    getManagementBooks: () => {
        return axios.get(`${DOMAIN}/book/management`, {
            json: true,
            headers: {...headers, token: store.getState().app.token},
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
            .catch(logoutMiddleware)
    },
    addBook: (data) => {
        return axios.post(`${DOMAIN}/book`, data, {
            headers: {...headers, token: store.getState().app.token, "Content-Type": "multipart/form-data"},
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
            .catch(logoutMiddleware)
    },
    updateBook: (bookId, data) => {
        return axios.put(`${DOMAIN}/book/${bookId}`, data, {
            headers: {...headers, token: store.getState().app.token, "Content-Type": "multipart/form-data"},
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
            .catch(logoutMiddleware)
    },
    deleteBook: (bookId) => {
        return axios.delete(`${DOMAIN}/book/${bookId}`, {
            headers: {...headers, token: store.getState().app.token},
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
            .catch(logoutMiddleware)
    },
    restoreBook: (bookId) => {
        return axios.put(`${DOMAIN}/book/restore/${bookId}`, {}, {
            headers: {...headers, token: store.getState().app.token},
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
            .catch(logoutMiddleware)
    },
    removeBookPermanently: (bookId) => {
        return axios.delete(`${DOMAIN}/book/remove-permanently/${bookId}`, {
            headers: {...headers, token: store.getState().app.token},
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
            .catch(logoutMiddleware)
    },
    search: (searchType, data, source) => {
        return axios.get(`${DOMAIN}/search/${searchType}`, {
            params: data,
            // cancelToken: source && source.token
        }, {
            headers: {...headers}
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    },
    findInOtherBooks: (searchType, data) => {
        return axios.get(`${DOMAIN}/search/findOtherMatches`, {
            params: data,
        }, {
            headers: {...headers}
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    },
    updateBuyingVerses: (data) => {
        return axios.post(`${DOMAIN}/verses`, data)
            .then(response => {
                return response.data;
            }, {
                headers: {...headers}
            })
            .then(responseMiddleware)
    },
    checkAvailability: async (selectedBook, versesIds, ranges, toSave) => {
        const vId = window.visitorId || await loadFingerPrint();
        return axios.post(`${DOMAIN}/verses/check-availability`, {
            selectedBook, versesIds, ranges, toSave
        }, {
            headers: {...headers, 'visitor-id': vId},
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    },
    downloadXlsx: (bookId) => {
        return axios.get(`${DOMAIN}/book/download-xlsx/${bookId}`, {
            responseType: 'arraybuffer',
            headers: {...headers, token: store.getState().app.token},
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Accept': 'application/pdf'
            // }
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
            .catch(logoutMiddleware)
    },
    getParashaByDate: (date) => {
        const tmp = moment(date, 'YYYY/MM/DD');
        // https://www.hebcal.com/home/195/jewish-calendar-rest-api
        // &maj=on&min=on&mod=on&nx=on&ss=on&mf=on&c=on&M=on&D=on
        return axios.get(`https://www.hebcal.com/hebcal?v=1&yt=G&cfg=json&start=${tmp.format('YYYY-MM-DD')}&end=${tmp.endOf('week').format('YYYY-MM-DD')}&s=on&lg=he`, {
            cors: true,
            headers: {},
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    },
    getSelectedVersesPriceAndAmount: (selectedVerses) => {
        return axios.post(`${DOMAIN}/verses/price`, {
            verses: selectedVerses.filter(v => !v.range).map(v => v._id).filter(v => v),
            ranges: selectedVerses.filter(v => v.range).map(v => {
                return {
                    book: v.book,
                    code: v.code,
                    bookId: v.bookId,
                }
            }).filter(v => v),
        }, {
            headers: {...headers}
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    },
    checkIFPaymentIsDone: (checkout) => {
        return axios.get(`${DOMAIN}/verses/check-payment-status?uniqueId=${checkout}`, {
            headers: {...headers}
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    },
    sendContactUs: (data) => {
        return axios.post(`${DOMAIN}/contactUs`, {
            ...data,
        },
            {
                headers: {...headers},
            })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    },
    updateContactUs: (data) => {
        return axios.put(`${DOMAIN}/contactUs`, {
            ...data,
        },
            {
                headers: {...headers},
            })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    },
    getContactUs: () => {
        return axios.get(`${DOMAIN}/contactUs`, {
            headers: {...headers}
        })
            .then(response => {
                return response.data;
            })
            .then(responseMiddleware)
    }
}

export default REST;
