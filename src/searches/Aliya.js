import React, {Component, useEffect, useState} from "react";
import {Button, Form} from 'react-bootstrap';
import rest, {getToken} from '../rest';
import {gematriyaNumbers, SPACE} from "../utils";
import {VersesRange} from "../components/VersesRange";
import {Loader} from "../components/Loader";
import {setSelectedVerses} from "../store/app/actions";
const Tora = require('../aliyot_client');

export const Aliya = ({donate, book, selectedVerses, searchType, callback, actions}) => {
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [chosenVerses, setChosenVerses] = useState([]);
    const [replaceVerse, setReplaceVerse] = useState(null);
    const [error, setError] = useState('');
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true);
    const [selectedAliyaBook, setSelectedAliyaBook] = useState(null);
    const [parasha, setParasha] = useState(null);
    const [aliya, setAliya] = useState(null);
    const [newAliya, setNewAliya] = useState(null);

    const fetchVersesWrapper = () => {

    }

    useEffect(() => {
        actions.setSelectedVerses([]);
    }, [aliya])

    useEffect(() => {
        setNewAliya(null);
        if (aliya && aliya.length) {
            setChosenVerses([]);
            setLoading(true);
            const newValues = [];
            Promise.all(aliya.map(async (value, index) => {
                await checkAvail(value, (response) => {
                    newValues[index] = value;
                }, (err) => {
                    newValues[index] = {...value, taken: true};
                })
            })).then(() => {
                setNewAliya(newValues);
            })
        }
    }, [aliya]);

    const checkAvail = async (value, callback, callbackError) => {
        await rest.checkAvailability(
            book._id,
            [],
            [{...value, bookId: book._id}],
            false,
        )
            .then(response => {
                callback(response);
            })
            .catch(err => {
                callbackError(err);
            })
    }

    const selectedVerse = (e, val) => {
        const value = e.target.checked;
        const prevVerses = chosenVerses;
        if (value === true) {
            prevVerses.push({...val, bookId: book._id});
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
        setSelectedAliyaBook(Tora[Number(event.target.value)]);
        setParasha(null);
        setAliya(null);
    }
    const onParashaSelected = (event) => {
        setParasha(selectedAliyaBook[event.target.selectedIndex]);
        const aliyot = Object.values(selectedAliyaBook.parasha[Number(event.target.value)].aliyot).map((val, index) => {
            return {
                range: true,
                _id: `${book._id}_${val.start.chapter}:${val.start.verse}-${val.end.chapter}:${val.end.verse}`,
                book: selectedAliyaBook.book,
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
                         name='select_book' defaultValue={'-1'}>
                        <option key={'-1'}>בחר חומש</option>
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
                                  disabled={!selectedAliyaBook}
                                  name='select_parasha' defaultValue={selectedAliyaBook}>
                        <option key={'-1'}>בחר פרשה</option>
                        {
                            selectedAliyaBook?.parasha.map((b, bi) => {
                                return <option key={bi} value={bi}>{b.name}</option>
                            })
                        }
                    </Form.Control>
                </Form.Group>
            </div>

            {error && <p>{error}</p>}

            <ol>
            {aliya && newAliya && aliya.map((val, index) => {
                return (<li key={`_${index}`} className='marginTop30px flex-row'>
                    <Form.Group className='d-flex flex-100 margin15 flex-row' controlId={`${index}}`}>
                        <Form.Check className={`flex-10 text-center ${(val.taken || newAliya && newAliya[index]?.taken) ? 'disabled' : ''}`}
                                    type='checkbox' value={val.id}
                                    onChange={(e) => selectedVerse(e, val)}
                                    disabled={val.taken || newAliya && newAliya[index]?.taken}/>
                        <Form.Label id={`_${val._id}}`}
                                    className={`flex-90 flex-column text-right`}>
                            <VersesRange val={val}/>
                        </Form.Label>
                    </Form.Group>
                </li>)
            })}
            </ol>

            {loading && <div
                className='d-flex flex-column flex-100 layout-align-center-center justify-content-center align-content-center'>
                <Loader/>
            </div>}
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
