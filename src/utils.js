import React from "react";
import {isBrowser, isMobile} from "react-device-detect";
const gematriya = require('gematriya');

export const IsMobile = isMobile;
export const IsBrowser = isBrowser;
export const isMobileView = ()=>{
    return window.innerWidth < 720;
}



const isASCII = (str) => {
    return /[\u0590-\u05FF]/.test(str);
}

export const countWeight = (str) => {
    let count = 0;
    for (let i = 0; i<str.length; i++){
        if (isASCII(str.charAt(i))) {
            count += 1;
        }
    }
    return count;
}


export const gematriyaNumbers = (num) => {
    return gematriya(num, {geresh: false, punctuate: false});
}

const hebMap = {
    "ן": "נ",
    "ם": "מ",
    "ף": "פ",
    "ץ": "צ",
    "ך": "כ",
}

export const gematriyaLetters = (str = '') => {
    let amount = 0;
    for(const i of str.split('').filter(isASCII).join('')) {
        amount += gematriya(hebMap[i] || i, {geresh: false, punctuate: false});
    }
    return amount;
}

export const SPACE = <span>&nbsp;</span>;

export const booksMap = {
    'Genesis': 1,
    'Exodus': 2,
    'Leviticus': 3,
    'Numbers': 4,
    'Deuteronomy': 5,
}
export const booksMapHeb = {
    1: 'בראשית',
    2: 'שמות',
    3: 'ויקרא',
    4: 'במדבר',
    5: 'דברים',
}
