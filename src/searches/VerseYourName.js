import React, {Component, useEffect, useState} from "react";
import {Button, Form,} from 'react-bootstrap';
import rest from '../rest';
import Spinner from 'react-bootstrap/Spinner'
import {TakenBy} from "../components/TakenBy";
import {AvailableBooks} from "../components/AvailableBooks";
import {VerseLocation} from "../components/VerseLocation";
import OtherBooksModal from "../components/OtherBooksModal";
import {Loader} from "../components/Loader";
import {LoadMore} from "../components/LoadMore";
import {VerseDisplay} from "../components/VerseDisplay";
import MyForm from "../components/Form";
import {getEnterYourNameForm} from "../config";

export const VerseYourName = ({donate, book, selectedVerses, searchType, callback, actions}) => {
    const [skip, setSkip] = useState(0);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [chosenVerses, setChosenVerses] = useState([]);
    const [replaceVerse, setReplaceVerse] = useState(null);
    const [error, setError] = useState('');
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true);

    const freeSearchForm = getEnterYourNameForm();
    let timeoutRef = null;

    const submit = (data) => {
        clearTimeout(timeoutRef);
        setSearchLoading(true);
        setVerses([]);
        setHasMoreAnswers(true);
        setSkip(0);
        timeoutRef = setTimeout(() => {
            setSearch(data.search.value);
        }, 1000);
    }

    useEffect(() => {
        actions.setSelectedVerses([]);
    }, [])

    useEffect(() => {
        if (!loading) {
            fetchVerses();
        }
    }, [search]);

    const fetchVerses = () => {
        const name = search.trim();
        if (name) {
            setLoading(true);
            rest.search(searchType, {name, bookId: book?._id, skip})
                .then(response => {
                    console.log(response.data);
                    
                    //setVerses(verses.concat(response.data));
                    setVerses(
                        [
                          {
                            "_id": "0",
                            "book": 1,
                            "chapter": 47,
                            "verse": 6,
                            "part": 84,
                            "text": "אֶרֶץ מִצְרַיִם לְפָנֶיךָ הִוא, בְּמֵיטַב הָאָרֶץ, הוֹשֵׁב אֶת־אָבִיךָ וְאֶת־אַחֶיךָ, יֵשְׁבוּ בְּאֶרֶץ גֹּשֶׁן, וְאִם־יָדַעְתָּ, וְיֶשׁ־בָּם אַנְשֵׁי־חַיִל, וְשַׂמְתָּם שָׂרֵי מִקְנֶה עַל־אֲשֶׁר־לִי",
                            "textWithout": "ארץ מצרים לפניך הוא, במיטב הארץ, הושב את-אביך ואת-אחיך, ישבו בארץ גשן, ואם-ידעת, ויש-בם אנשי-חיל, ושמתם שרי מקנה על-אשר-לי",
                            "gematriya": 6819,
                            "length": 91,
                            "bookId": "636d63ad1ef33ce1e412f8c9",
                            "availableBooks": 1
                          },
                          {
                            "_id": "1",
                            "book": 1,
                            "chapter": 47,
                            "verse": 6,
                            "part": 84,
                            "text": "אֶרֶץ מִצְרַיִם לְפָנֶיךָ הִוא, בְּמֵיטַב הָאָרֶץ, הוֹשֵׁב אֶת־אָבִיךָ וְאֶת־אַחֶיךָ, יֵשְׁבוּ בְּאֶרֶץ גֹּשֶׁן, וְאִם־יָדַעְתָּ, וְיֶשׁ־בָּם אַנְשֵׁי־חַיִל, וְשַׂמְתָּם שָׂרֵי מִקְנֶה עַל־אֲשֶׁר־לִי",
                            "textWithout": "ארץ מצרים לפניך הוא, במיטב הארץ, הושב את-אביך ואת-אחיך, ישבו בארץ גשן, ואם-ידעת, ויש-בם אנשי-חיל, ושמתם שרי מקנה על-אשר-לי",
                            "gematriya": 6819,
                            "length": 91,
                            "bookId": "636d63ad1ef33ce1e412f8c9",
                            "availableBooks": 1
                          },                          {
                            "_id": "44",
                            "book": 1,
                            "chapter": 47,
                            "verse": 6,
                            "part": 84,
                            "text": "אֶרֶץ מִצְרַיִם לְפָנֶיךָ הִוא, בְּמֵיטַב הָאָרֶץ, הוֹשֵׁב אֶת־אָבִיךָ וְאֶת־אַחֶיךָ, יֵשְׁבוּ בְּאֶרֶץ גֹּשֶׁן, וְאִם־יָדַעְתָּ, וְיֶשׁ־בָּם אַנְשֵׁי־חַיִל, וְשַׂמְתָּם שָׂרֵי מִקְנֶה עַל־אֲשֶׁר־לִי",
                            "textWithout": "ארץ מצרים לפניך הוא, במיטב הארץ, הושב את-אביך ואת-אחיך, ישבו בארץ גשן, ואם-ידעת, ויש-בם אנשי-חיל, ושמתם שרי מקנה על-אשר-לי",
                            "gematriya": 6819,
                            "length": 91,
                            "bookId": "636d63ad1ef33ce1e412f8c9",
                            "availableBooks": 1
                          }
                        ]
                     );
                    setLoading(false);
                    setSearchLoading(false);
                    setSkip(() => {
                        return skip + 1;
                    })
                    if (!response.hasMore) {
                        setHasMoreAnswers(false);
                    }
                    if (!response.data.length && !verses.length) {
                        throw new Error('');
                    }
                    setError('');
                })
                .catch(err => {
                    setError('לא נמצאו תוצאות');
                })
        }
    }

    const selectedVerse = (e, val) => {
        const value = e.target.checked;
        const prevVerses = chosenVerses;
        if (value === true) {
            prevVerses.push(val);
        } else {
            const index = prevVerses.findIndex(v => v._id === val._id);
            prevVerses.splice(index, 1);
        }
        setChosenVerses(prevVerses);
        actions.setSelectedVerses(prevVerses);
        callback(prevVerses.length);
    }

    const searchInOtherBooks = (index, val) => {
        setReplaceVerse(val);
    }

    const onVerseReplaced = (selected, original) => {
        console.log('selected', selected);
        setReplaceVerse(null);
        if (selected) {
            selected.availableBooks = original.availableBooks;
            const prevVerses = verses;
            const index = prevVerses.findIndex(v => v._id === original._id);
            if (index !== -1) {
                prevVerses.splice(index, 1);
                prevVerses.splice(index, 0, selected);
            }
            setVerses(prevVerses);
            console.log('prevVerses', prevVerses)
        }
    }

    return (
        <div className='d-flex flex-column flex-100 justify-content-center align-content-center'>
            <MyForm fields={freeSearchForm}
                    loading={searchLoading}
                    submitText={"חפש"}
                    callback={submit}
            />
            {error && <p>{error}</p>}
            {verses.map((val, index) => {
                return (
                // <div key={`_${val._id}`} className='marginTop30px flex-row'>
                    <Form.Group className='margin15' controlId={`${val._id}}`}>
                        <Form.Check className={`verse-checkbox text-center`} type='checkbox' value={val.id}
                                    onChange={(e) => selectedVerse(e, val)}
                                    disabled={val.taken}
                                    label={
                                        <div className={`text-right ${val.taken && 'disabled-color'}`}>
                                            <VerseDisplay val={val} showLength onSearchInOtherBooks={searchInOtherBooks.bind(this, index, val)}/>
                                        </div>
                                    }/>
                        {/* <Form.Label id={`_${val._id}}`}
                                    className={`flex-90 flex-column text-right ${val.taken && 'disabled-color'}`}>
                            <VerseDisplay val={val} />
                            {(val.taken && val.availableBooks || val.bookInfo && val.availableBooks > 1) && <React.Fragment>
                                <Button onClick={searchInOtherBooks.bind(this, index, val)}
                                        className='btn-outline-primary'>
                                    חפש בספרי תורה אחרים
                                </Button>
                            </React.Fragment> || ''}
                        </Form.Label> */}
                    </Form.Group>
                // </div>
                )
            })}
            {loading && <div
                className='d-flex flex-column flex-100 layout-align-center-center justify-content-center align-content-center'>
                <Loader/>
            </div>}
            {!loading && verses.length && <LoadMore callback={fetchVerses} show={hasMoreAnswers}/> || ''}
            {replaceVerse && <OtherBooksModal searchType={searchType}
                 callback={onVerseReplaced.bind(this)}
                 bookId={replaceVerse.bookId}
                 textWithout={replaceVerse.textWithout}
                 originalVerse={replaceVerse}
            />}
        </div>
    )
}

const styles = {
    gray: {
        color: 'gray',
        fontSize: '14px',
    },
    list: {
        listStyleType: 'circle'
    }
};
