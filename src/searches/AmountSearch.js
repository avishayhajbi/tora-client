import React, {Component, useEffect, useState} from "react";
import {Button, Form} from 'react-bootstrap';
import rest, {getToken} from '../rest';
import {TakenBy} from "../components/TakenBy";
import {AvailableBooks} from "../components/AvailableBooks";
import {VerseLocation} from "../components/VerseLocation";
import OtherBooksModal from "../components/OtherBooksModal";
import {getAmountForm} from "../config";
import {default as MyForm} from "../components/Form";
import {SPACE} from "../utils";
import {Loader} from "../components/Loader";
import {LoadMore} from "../components/LoadMore";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {VerseDisplay} from "../components/VerseDisplay";

let skip = 0;
export const AmountSearch = ({donate, book, selectedVerses, searchType, callback, actions}) => {
    // const [skip, setSkip] = useState(0);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    // const [search, setSearch] = useState(100);
    const [chosenVerses, setChosenVerses] = useState([]);
    const [replaceVerse, setReplaceVerse] = useState(null);
    const [error, setError] = useState('');
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true);
    // const [radioValue, setRadioValue] = useState('1');
    const [formValue, setFormValue] = useState({radioValue: '1', search: ''});

    const amountForm = getAmountForm();
    let timeoutRef = null;
    // let axiosSession;

    const setSkip = (newVal) => {
        skip = newVal;
    }

    useEffect(() => {
        actions.setSelectedVerses([]);
    }, []);

    useEffect(() => {
        if (!loading) {
            setVerses([]);
            setHasMoreAnswers(true);
            setSkip(0);
            fetchVerses();
        }
    }, [formValue]);

    const fetchVerses = () => {
        const amount = Number(formValue.search) || 0;
        if (amount) {
            setError('');
            rest.search(searchType, {amount, bookId: book?._id, skip, radioValue: formValue.radioValue})
                .then(response => {
                    console.log(response.data);
                    setVerses(prev => ([...prev, ...response.data]));
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
        setSkip(skip + 1);
        setLoading(true);
        fetchVerses();
    }

    const selectedVerse = (e, values) => {
        const value = e.target.checked;
        const prevVerses = [];
        if (value === true) {
            document.querySelectorAll('input[type="radio"]').forEach(v=> v.checked = false);
            e.currentTarget.checked = true;
            if (values.find(v => v.taken)) {
                actions.updateModal({
                    show: true,
                    title: 'שים לב',
                    body: 'אחד מהפסוקים שבחרת כבר תפוס, אנא בחר ספר תורה אחר שבו תוכל לרכוש את הפסוק',
                    hideFooter: true,
                });
                e.target.checked = false;
            } else {
                prevVerses.push(...values);
            }
        } else {
            /*for (const val of values) {
                for (let i = prevVerses.length; i >= 0; i--) {
                    const index = prevVerses.findIndex(v => v._id === val._id);
                    prevVerses.splice(index, 1);
                    if (index !== -1) {
                        break;
                    }
                }
            }*/
        }
        setChosenVerses(prevVerses);
        actions.setSelectedVerses(prevVerses);
        callback(prevVerses.length);
    }

    const searchInOtherBooks = (index, valIndex, val) => {
        setReplaceVerse(val);
    }

    const onVerseReplaced = (selected, original) => {
        console.log('selected', selected);
        setReplaceVerse(null);
        if (selected) {
            selected.availableBooks = original.availableBooks;
            const prevVerses = verses;
            for (let i = prevVerses.length -1 ; i >= 0; i--) {
                const index = prevVerses[i].findIndex(v => v._id === original._id);
                if (index !== -1) {
                    prevVerses[i].splice(index, 1);
                    prevVerses[i].splice(index, 0, selected);
                }
            }
            // const index = prevVerses.findIndex(v => v._id === original._id);
            // if (index !== -1) {
            //     prevVerses.splice(index, 1);
            //     prevVerses.splice(index, 0, selected);
            // }
            setVerses(prevVerses);
            console.log('prevVerses', prevVerses)
        }
    }

    const submit = (data) => {
        if (
            data.search.value !== String(formValue.search) ||
            data.radioValue.value !== formValue.radioValue
        ) {
            setSearchLoading(true);
            setVerses([]);
            setHasMoreAnswers(true);
            setSkip(0);
            setTimeout(() => {
                setFormValue({
                    search: data.search.value,
                    radioValue: data.radioValue.value,
                });
                setChosenVerses([]);
                actions.setSelectedVerses([]);
                callback(0);
            }, 1000)
        }

    }

    // const getVersesView = (values, index) => {
    //     return (<Form.Label id={`_${index}}`} className={`flex-90 flex-column text-right`}>
    //         {
    //             values.map((val, valIndex) => {
    //                 return (<div key={`${index}_${valIndex}`} className="paddBottom10px">
    //                     <VerseDisplay val={val} showLength={true} />
    //                     {(val.taken && val.availableBooks || val.bookInfo && val.availableBooks > 1) &&
    //                     <React.Fragment>
    //                         <Button onClick={searchInOtherBooks.bind(this, index, valIndex, val)}
    //                                 className='btn-outline-primary'>
    //                             חפש בספרי תורה אחרים
    //                         </Button>
    //                     </React.Fragment> || ''}
    //                 </div>)
    //             })
    //         }
    //     </Form.Label>)
    // }
    const getVersesView = (values, index) => {
        return (<div className={`text-right`}>
            {
                values.map((val, valIndex) => 
                        <VerseDisplay val={val} showLength={true} onSearchInOtherBooks={searchInOtherBooks.bind(this, index, valIndex, val)} key={`${index}_${valIndex}`} />
                )
            }
        </div>)
    }

    return (
        <div className='d-flex flex-column flex-100 justify-content-center align-content-center'>
            <MyForm fields={amountForm}
                  loading={searchLoading}
                  submitText={"חפש"}
                  callback={submit}
            />
            {error && <p>{error}</p>}
            {verses.map((values, index) => {
                return (
                // <div key={`_${index}`} className='marginTop30px flex-row'>
                    <Form.Group key={`_${index}`} className='margin15 ' controlId={`${index}`}>
                        <Form.Check className={`verse-checkbox text-center`} type='radio' value={index}
                                    onChange={(e) => selectedVerse(e, values)}
                                    label={getVersesView(values, index)}

                        />
                        {/* {getVersesView(values, index)} */}
                    </Form.Group>
                // </div>
                )
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
