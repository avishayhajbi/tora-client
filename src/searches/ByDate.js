import React, {Component, useEffect, useState} from "react";
import {Button, Form} from 'react-bootstrap';
import rest from '../rest';
import OtherBooksModal from "../components/OtherBooksModal";
import {getByDateForm} from "../config";
import {default as MyForm} from "../components/Form";
import {Loader} from "../components/Loader";
import {LoadMore} from "../components/LoadMore";
import {gematriyaNumbers} from "../utils";
import moment from "moment";
import {VersesRange} from "../components/VersesRange";
import {booksMap} from "../utils";
import {HDate, Sedra} from '@hebcal/core';

export const ByDate = ({donate, book, selectedVerses, searchType, callback, actions}) => {
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [parasha, setParasha] = useState(null);
    const [chosenVerses, setChosenVerses] = useState([]);
    const [replaceVerse, setReplaceVerse] = useState(null);
    const [error, setError] = useState('');
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true);


    const byDateForm = getByDateForm();
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
        const date = search.trim();
        if (date) {
            rest.getParashaByDate(date)
                .then(res => {
                    if (res.items.length) {
                        const parasha = res.items.find(v => v.category === 'parashat');
                        setParasha({
                            title: parasha.title,
                            aliya: Object.keys(parasha.leyning).map((v, vi) => {
                                if (['1', '2', '3', '4', '5', '6', '7'].includes(v)) {
                                    const bookName = parasha.leyning[v].split(' ')[0];
                                    const tmp = parasha.leyning[v].split(' ')[1];
                                    const code = transformAliya(tmp);
                                    return {
                                        range: true,
                                        _id: `${book._id}_${code.start.chapter}:${code.start.verse}-${code.end.chapter}:${code.end.verse}`,
                                        book: booksMap[bookName],
                                        code,
                                        transformed: [`פרק ${gematriyaNumbers(code.start.chapter)} פסוק ${gematriyaNumbers(code.start.verse)}`, `פרק ${gematriyaNumbers(code.end.chapter)} פסוק ${gematriyaNumbers(code.end.verse)}`],
                                    };
                                }
                            }).filter(v => v),
                        });
                    }
                    setLoading(false);
                    setSearchLoading(false);
                })
                .catch(err => {

                })
        } else {
            setSearchLoading(false);
        }
    }

    const fetchVersesWrapper = () => {
        setLoading(true);
        fetchVerses();
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
        setVerses([]);
        setSearchLoading(true);
        setHasMoreAnswers(true);
        timeoutRef = setTimeout(() => {
            const tmp = moment(data.date.value, 'YYYY/MM/DD');
            const hdate = new HDate(new Date(tmp));
            const date13 = hdate.add(13, 'y');
            // const sedra = new Sedra(date13.year, true);
            // console.log(sedra.lookup(date13));
            const format = moment(date13.greg()).format('YYYY/MM/DD');
            if (search !== format) {
                setSearch(format);
            } else {
                setSearchLoading(false);
                setHasMoreAnswers(false);
            }
        }, 1000);
    }

    const transformAliya = (val) => {
        const pos = val.split('-');
        const posA = pos[0].split(':').map(Number);
        const posB = pos[1].split(':').map(Number);
        return {
            start: {
                chapter: posA[0],
                verse: posA[1],
            },
            end: {
                chapter: posB[0],
                verse: posB[1],
            }
        }
    }

    return (
        <div className='d-flex flex-column flex-100 justify-content-center align-content-center'>
            <MyForm fields={byDateForm}
                  loading={searchLoading}
                  submitText={"חפש"}
                  callback={submit}
            />
            {error && <p>{error}</p>}
            <h5>{parasha && parasha.title}</h5>
            <ol>
            {parasha && parasha.aliya.map((val, index) => {
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
