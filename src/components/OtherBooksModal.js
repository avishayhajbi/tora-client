import React, {Component, useEffect, useState} from "react";
import {Modal, Button, Form,} from 'react-bootstrap';
import rest from "../rest";
import MyModal from "../components/Modal";
import {Book} from "../components/Book";
import Spinner from "react-bootstrap/Spinner";
import {VerseLocation} from "../components/VerseLocation";
import { BookSelect } from "./BookSelect";

const OtherBooksModal = ({searchType, callback, bookId, textWithout, originalVerse}) => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [samePlace, setSamePlace] = useState(false);

    useEffect(() => {
        setShow(true);
        rest.findInOtherBooks(searchType, {bookId, text: textWithout})
            .then(response => {
                console.log(response.data);
                setResults(response.data);
                setLoading(false);
            })
            .catch(err => {

            })
    }, []);

    const updateSelected = (e, res) => {
        if (samePlace) {
            const verses = res.verses.filter(verseInSamePlace);
            // setSelectedBook(verses[0]);
            callback(verses[0], originalVerse);
        } else {
            //setSelectedBook(res.verses[0]);
            callback(res.verses[0], originalVerse);
        }
        setShow(false);
    }

    const chooseSpecificPlace = (e) => {
        const name = e.target.name;
        const value = e.target.checked;
        setSamePlace(value);
        if (value && selectedBook) {
            const isOk = verseInSamePlace(selectedBook);
            if (!isOk) {
                setSelectedBook(null);
            }
        }
    }

    const onHide = () => {
        setShow(false);
        callback(selectedBook, originalVerse);
    }

    const verseInSamePlace = (d) => {
        return d.book === originalVerse.book &&
            d.chapter === originalVerse.chapter &&
            d.verse === originalVerse.verse
    }

    const onFormClick = (e) => {
        // e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    return (
        <MyModal onHide={onHide.bind(this)} show={show} title={'הפסוק אשר חיפשתם ניתן לרכישה בספרי התורה הבאים:'}
        // buttons={[
        //     {
        //         name: 'בחר',
        //     }
        // ]}
        >
            {loading && <div
                className='d-flex flex-column flex-100 layout-align-center-center justify-content-center align-content-center'>
                <Spinner animation="border"/>
            </div>}
            <Form onClick={onFormClick.bind(this)}>
                {<Form.Group className='d-flex flex-100 margin15 flex-row' controlId={`sameGroup1`}>
                    <Form.Check className='flex-10 text-center'
                                type='checkbox' name={'sameGroup1'}
                                onChange={(e) => {
                                    chooseSpecificPlace(e);
                                }}/>
                    <Form.Label className={`flex-90 flex-column text-right`}>
                        חפש באותו מיקום בדיוק
                        <span className="pr-2" style={styles.gray}>
                            <VerseLocation {...originalVerse} />
                        </span>
                    </Form.Label>
                </Form.Group> || ''}
                <div className='width100 flex-column flex-wrap justify-content-center align-items-center'>
                {results.filter(v => samePlace ? v.verses.filter(verseInSamePlace).length : v).filter(v => v.verses.length).map((res, index) => {
                    const verse = res.verses[0];
                    const id = Date.now().toString() + index;
                    return <div key={id}>
                                <BookSelect
                                book={verse.bookInfo}
                                onSelectBook={(e) => {updateSelected(e, res)}}
                            />
                        {/* <Form.Group className='d-flex flex-100 margin15 flex-row' controlId={`${id}`}>
                            <Form.Check className='flex-10 text-center'
                                        type='radio' value={verse._id} name={'sameGroup'}
                                        onChange={(e) => {
                                            updateSelected(e, res)
                                        }}/>
                            <Form.Label id={`${id}`} className={`flex-90 flex-column text-right`} >
                                <Book {...verse.bookInfo}/>
                            </Form.Label>
                        </Form.Group> */}
                    </div>
                })}
                </div>
            </Form>
        </MyModal>
    )
}

const styles = {
    gray: {
        color: 'gray',
        fontSize: '14px',
    },
};
export default OtherBooksModal;
