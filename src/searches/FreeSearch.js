import React, {Component, useEffect, useState} from "react";
import {Button, Form} from 'react-bootstrap';
import rest from '../rest';
import Spinner from 'react-bootstrap/Spinner'
import {TakenBy} from "../components/TakenBy";
import {AvailableBooks} from "../components/AvailableBooks";
import {VerseLocation} from "../components/VerseLocation";
import OtherBooksModal from "../components/OtherBooksModal";
import {getFreeSearchForm} from "../config";
import {default as MyForm} from "../components/Form";
import {Loader} from "../components/Loader";
import {LoadMore} from "../components/LoadMore";
import {VerseDisplay} from "../components/VerseDisplay";

export const FreeSearch = ({donate, book, selectedVerses, searchType, callback, actions}) => {
    const [skip, setSkip] = useState(0);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [chosenVerses, setChosenVerses] = useState([]);
    const [replaceVerse, setReplaceVerse] = useState(null);
    const [error, setError] = useState('');
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true);


    const freeSearchForm = getFreeSearchForm();
    let timeoutRef = null;

    useEffect(() => {
        actions.setSelectedVerses([]);
    }, [])

    useEffect(() => {
        if (!loading) {
            fetchVerses();
        }

    }, [search]);

    const fetchVerses = () => {
        const text = search.trim();
        if (text) {
            setError('');
            rest.search(searchType, {text, bookId: book?._id, skip})
                .then(response => {
                    console.log(response.data);
                    setVerses(verses.concat(response.data));
                    setLoading(false);
                    setSearchLoading(false);
                    if (!response.hasMore) {
                        setHasMoreAnswers(false);
                    }
                    if (!response.data.length && !verses.length) {
                        setError('לא נמצאו תוצאות');
                    }
                })
                .catch(err => {
                    setLoading(false);
                    setSearchLoading(false);
                    setError('לא נמצאו תוצאות');
                })
        } else {
            setSearchLoading(false);
        }
    }

    const fetchVersesWrapper = () => {
        setSkip(() => {
            return skip + 1;
        })
        setLoading(true);
        fetchVerses();
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

    return (
        <div className='d-flex flex-column flex-100 justify-content-center align-content-center'>
            <MyForm fields={freeSearchForm}
                  loading={searchLoading}
                  submitText={"חפש"}
                  callback={submit}
            />
            {error && <p>{error}</p>}
            {verses.map((val, index) => {
                return (<div key={`_${val._id}`} className='marginTop30px flex-row'>
                    <Form.Group className='d-flex flex-100 margin15 flex-row' controlId={`${val._id}}`}>
                        <Form.Check className={`flex-10 text-center`} type='checkbox' value={val.id}
                                    onChange={(e) => selectedVerse(e, val)}
                                    disabled={val.taken}/>
                        <Form.Label id={`_${val._id}}`}
                                    className={`flex-90 flex-column text-right`}>
                            <VerseDisplay val={val} />
                            {(val.taken && val.availableBooks || val.bookInfo && val.availableBooks > 1) && <React.Fragment>
                                <Button onClick={searchInOtherBooks.bind(this, index, val)}
                                        className='btn-outline-primary'>
                                    חפש בספרי תורה אחרים
                                </Button>
                            </React.Fragment> || ''}
                        </Form.Label>
                    </Form.Group>
                </div>)
            })}
            {loading && <div
                className='d-flex flex-column flex-100 layout-align-center-center justify-content-center align-content-center'>
                <Loader/>
            </div>}
            {!loading && verses.length && <LoadMore callback={fetchVersesWrapper} show={hasMoreAnswers}/> || ''}
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
