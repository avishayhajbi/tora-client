import cloneDeep from 'lodash/cloneDeep';
import keyMirror from 'key-mirror';
import moment from 'moment';
import * as ICONS from '@fortawesome/free-solid-svg-icons';

export const LOCAL_STORAGE = keyMirror({
    VERSES_INFO: null,
    BOOK_INFO: null,
    DONATE_INFO: null,
    LOGIN_INFO: null,
    TOKEN: null,
    USERNAME: null,
    CART_INFO: null,
})

export const getLoginForm = () => {
    let form = {
        user: {
            value: '',
            title: 'שם משתמש',
            settings: {},
            type: 'text',
        },
        password: {
            value: '',
            title: 'סיסמא',
            type: 'password',
        },
    }
    return cloneDeep(form);
};

export const getDonateForm = () => {
    let form = {
        name: {
            value: '',
            title: 'שם פרטי',
            type: 'text',
            settings: {required: true},
        },
        lastName: {
            value: '',
            title: 'שם משפחה',
            type: 'text',
            settings: {},
        },
        phone: {
            value: '',
            title: 'טלפון',
            settings: {pattern: '[0-9]*', required: true},
            type: 'tel',
        },
        address: {
            value: '',
            settings: {rows: 3},
            title: 'כתובת',
            type: 'textarea',
        },
        email: {
            value: '',
            title: 'אימייל',
            type: 'email',
            settings: {},
        }
    }
    return cloneDeep(form);
};

export const getContributionForm = () => {
    let form = {
        contributionName: {
            value: '',
            title: 'שם פרטי',
            type: 'text',
            settings: {required: true},
        },
        contributionLastName: {
            value: '',
            title: 'שם משפחה',
            type: 'text',
            settings: {},
        },
        contributionMessage: {
            value: '',
            settings: {rows: 3},
            title: 'כתובת',
            type: 'textarea',
        },
        contributionEmail: {
            value: '',
            title: 'אימייל',
            type: 'email',
            settings: {},
        },
    }
    return cloneDeep(form);
};

export const BooksCategoriesKeys = {
    'synagogues': 'synagogues',
    'tombsOfTheRighteous': 'tombsOfTheRighteous',
    'hospitals': 'hospitals',
    'IDF': 'IDF',
    'other': 'other',
}

export const BooksCategoriesValues = {
    [BooksCategoriesKeys.synagogues]: 'בתי כנסיות',
    [BooksCategoriesKeys.tombsOfTheRighteous]: 'קברות צדיקים',
    [BooksCategoriesKeys.hospitals]: 'בתי חולים',
    [BooksCategoriesKeys.IDF]: 'בסיסי צה״ל',
    [BooksCategoriesKeys.other]: 'שונות',
}

export const getBookForm = () => {
    let form = {
        address: {
            value: '',
            title: 'כתובת',
            type: 'textarea',
            settings: {required: true},
        },
        description: {
            value: '',
            title: 'תיאור כללי של המקום',
            type: 'textarea',
            settings: {required: true},
        },
        writer_notes: {
            value: '',
            settings: {rows: 3},
            title: 'הקדשה של מפרסם הספר',
            type: 'textarea',
        },
        tel: {
            value: '',
            title: 'טלפון',
            settings: {pattern: '[0-9]*'},
            type: 'tel',
        },
        weight: {
            value: '',
            title: 'משקל',
            type: 'tel',
            settings: {pattern: '[0-9]*'},
        },
        category: {
            value: '',
            title: ' קטגוריה',
            type: 'select',
            settings: {},
            options: [
                {key: '', value: 'בחר קטגוריה'},
                {key: BooksCategoriesKeys.synagogues, value: BooksCategoriesValues[BooksCategoriesKeys.synagogues]},
                {key: BooksCategoriesKeys.tombsOfTheRighteous, value: BooksCategoriesValues[BooksCategoriesKeys.tombsOfTheRighteous]},
                {key: BooksCategoriesKeys.hospitals, value: BooksCategoriesValues[BooksCategoriesKeys.hospitals]},
                {key: BooksCategoriesKeys.IDF, value: BooksCategoriesValues[BooksCategoriesKeys.IDF]},
                {key: BooksCategoriesKeys.other, value: BooksCategoriesValues[BooksCategoriesKeys.other]},
            ]
        },
    }
    return cloneDeep(form);
};
export const getFreeSearchForm = () => {
    let form = {
        search: {
            value: '',
            title: 'חיפוש חופשי',
            placeholder: 'חיפוש חופשי',
            type: 'search',
            settings: {required: true}
        },
    }
    return cloneDeep(form);
};
export const getEnterYourNameForm = () => {
    let form = {
        search: {
            value: '',
            title: 'שם:',
            placeholder: 'הזינו את שמכם..',
            type: 'search',
            settings: {required: true}
        },
    }
    return cloneDeep(form);
};
export const freeSearchFormWithButtons = () => {
    const tmp = getEnterYourNameForm();
    let form = {
        ...tmp,
        // todo: adding complex buttons here
        radioValue: {
            type: 'radio',
            value: '',
            title: '',
            settings: {multiple: false},
            selected: '3',
            options: [
                { value: 'צירוף 1', key: '1' },
                { value: '2 צירופים', key: '2' },
                { value: '3 צירופים', key: '3' },
                { value: '4 צירופים', key: '4' },
                { value: '5 צירופים', key: '5' },
            ]
        }
    }
    return cloneDeep(form);
};
export const getAmountForm = () => {
    let form = {
        search: {
            value: '100',
            title: 'חפש לפי סכום',
            placeholder: 'חפש לפי סכום',
            type: 'number',
            settings: {min: 0, required: true}
        },
    }
    return cloneDeep(form);
};
export const getByDateForm = () => {
    let form = {
        date: {
            title: 'חפש לפי תאריך לידה',
            placeholder: 'תאריך לידה',
            type: 'date',
            settings: {'data-date-format': "DD/MM/YYYY", required: true}
        },
    }
    return cloneDeep(form);
};

export const uploadImage = () => {
    let form = {
        image_url: {
            value: '',
            title: 'העלאת תמונה',
            type: 'file',
            settings: {},
        },
    }
    return cloneDeep(form);
};

export const SearchTypes = {
    freeSearch: 'freeSearch',
    firstAndLastLetter: 'firstAndLastLetter',
    aliya: 'aliya',
    gematria: 'gematria',
    verseYourName: 'verseYourName',
    byDate: 'byDate',
    amount: 'amount',
    random: 'random',
};

export const getSearchTypes = () => cloneDeep([
    {id: SearchTypes.freeSearch, name: 'חיפוש חופשי'},
    {id: SearchTypes.firstAndLastLetter, name: 'אות ראשונה ואות אחרונה בספר תורה'},
    {id: SearchTypes.aliya, name: 'עליה'},
    {id: SearchTypes.gematria, name: 'גימטריה של שמך'},
    {id: SearchTypes.verseYourName, name: 'פסוק עם שמך'},
    {id: SearchTypes.byDate, name: 'פרשת עליה לתורה (חיפוש לפי תאריך)'},
    {id: SearchTypes.amount, name: 'סכום'},
    {id: SearchTypes.random, name: 'רנדומלי'},
]);

export const BooksMap = {
    1: 'בראשית',
    2: 'שמות',
    3: 'ויקרא',
    4: 'במדבר',
    5: 'דברים',
}
