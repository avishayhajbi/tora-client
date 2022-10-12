import React, {Component, useEffect, useState} from "react";
import {Button, Form} from 'react-bootstrap';
import rest, {getToken} from '../rest';
import {TakenBy} from "../components/TakenBy";
import {AvailableBooks} from "../components/AvailableBooks";
import {VerseLocation} from "../components/VerseLocation";
import OtherBooksModal from "../components/OtherBooksModal";
import {getAmountForm} from "../config";
import {default as MyForm} from "../components/Form";
import {gematriyaNumbers, SPACE} from "../utils";
import {Loader} from "../components/Loader";
import {LoadMore} from "../components/LoadMore";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {VersesRange} from "../components/VersesRange";
const Tora = require('../aliyot_client');

export const Aliya = ({donate, book, selectedVerses, searchType, callback, actions}) => {
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [chosenVerses, setChosenVerses] = useState([]);
    const [replaceVerse, setReplaceVerse] = useState(null);
    const [error, setError] = useState('');
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [parasha, setParasha] = useState(null);
    const [aliya, setAliya] = useState(null);

    const fetchVersesWrapper = () => {
        setLoading(true);
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
        console.log(prevVerses)
        setChosenVerses(prevVerses);
        actions.setSelectedVerses(prevVerses);
        callback(prevVerses.length);
    }

    const onBookSelected = (event) => {
        setSelectedBook(Tora[Number(event.target.value)]);
        setParasha(null);
        setAliya(null);
    }
    const onParashaSelected = (event) => {
        setParasha(selectedBook[event.target.selectedIndex]);
        const aliyot = Object.values(selectedBook.parasha[Number(event.target.value)].aliyot).map((val, index) => {
            return {
                range: true,
                _id: index,
                book: selectedBook.book,
                code: val,
                transformed: [`פרק ${gematriyaNumbers(val.start.chapter)} פסוק ${gematriyaNumbers(val.start.verse)}`, `פרק ${gematriyaNumbers(val.end.chapter)} פסוק ${gematriyaNumbers(val.end.verse)}`],
            };
        })
        setAliya(aliyot)

    }

    return (
        <div className='d-flex flex-column flex-100 justify-content-center align-content-center'>

            <div className=''>
                <Form.Group controlId='select_book' className='form-group'>
                    <Form.Label>בחר חומש</Form.Label>
                    <Form.Control as="select" onChange={(event) => onBookSelected(event)}
                         name='select_book'>
                        <option selected={true} key={'-1'}>בחר חומש</option>
                        {
                            Tora.map((b, bi) => {
                                return <option key={bi} value={bi}>{b.name}</option>
                            })
                        }
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='select_parasha' className='form-group'>
                    <Form.Label>בחר פרשה</Form.Label>
                    <Form.Control as="select" onChange={(event) => onParashaSelected(event)}
                                  disabled={!selectedBook}
                                  name='select_parasha'>
                        <option selected={!selectedBook} key={'-1'}>בחר פרשה</option>
                        {
                            selectedBook?.parasha.map((b, bi) => {
                                return <option key={bi} value={bi}>{b.name}</option>
                            })
                        }
                    </Form.Control>
                </Form.Group>
            </div>

            {error && <p>{error}</p>}

            <ol>
            {aliya && aliya.map((val, index) => {
                return (<li key={`_${index}`} className='marginTop30px flex-row'>
                    <Form.Group className='d-flex flex-100 margin15 flex-row' controlId={`${index}}`}>
                        <Form.Check className={`flex-10 text-center`} type='checkbox' value={val.id}
                                    onChange={(e) => selectedVerse(e, val)}
                                    disabled={val.taken}/>
                        <Form.Label id={`_${val._id}}`}
                                    className={`flex-90 flex-column text-right ${val.taken && 'disabled-color'}`}>
                            <VersesRange val={val}/>
                        </Form.Label>
                    </Form.Group>
                </li>)
            })}
            </ol>
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
