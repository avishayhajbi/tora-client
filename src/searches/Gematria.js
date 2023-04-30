import React, {Component, useEffect, useState} from "react";
import {Button, Form,} from 'react-bootstrap';
import rest from '../rest';
import OtherBooksModal from "../components/OtherBooksModal";
import {gematriyaLetters, SPACE} from "../utils";
import {Loader} from "../components/Loader";
import {LoadMore} from "../components/LoadMore";
import {VerseDisplay} from "../components/VerseDisplay";
import {freeSearchFormWithButtons} from "../config";
import MyForm from "../components/Form";

let skip = 0;
export const Gematria = ({donate, book, selectedVerses, searchType, callback, actions}) => {
    // const [skip, setSkip] = useState(0);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    // const [search, setSearch] = useState('');
    const [chosenVerses, setChosenVerses] = useState([]);
    const [replaceVerse, setReplaceVerse] = useState(null);
    const [gematri, setGematri] = useState(0);
    const [error, setError] = useState('');
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true);
    // const [radioValue, setRadioValue] = useState('3');
    const [formValue, setFormValue] = useState({radioValue: '1', search: ''});

    const freeSearchFormWithButtonsForm = freeSearchFormWithButtons();
    let timeoutRef = null;

    const setSkip = (newVal) => {
        skip = newVal;
    }

    useEffect(() => {
        actions.setSelectedVerses([]);
    }, [])

    useEffect(() => {
        if (!loading) {
            setVerses([]);
            setHasMoreAnswers(true);
            setSkip(0);
            fetchVerses();
        }
    }, [formValue]);

    const fetchVerses = () => {
        const name = formValue.search.trim();
        if (name) {
            setError('');
            setGematri(gematriyaLetters(name));
            rest.search(searchType, {name, bookId: book?._id, skip, radioValue: formValue.radioValue})
                .then(response => {
                    console.log(response.data);
                    setVerses(prev => ([...prev, ...response.data]));
                    setLoading(false);
                    setSearchLoading(false);
                    if (!response.hasMore) {
                        setHasMoreAnswers(false);
                    }
                    if (!response.data.length && !verses.length) {
                        throw new Error('');
                    }
                })
                .catch(err => {
                    setLoading(false);
                    setSearchLoading(false);
                    setError('לא נמצאו תוצאות');
                })
        }
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
            data.search.value !== formValue.search ||
            data.radioValue.value !== formValue.radioValue
        ) {
            clearTimeout(timeoutRef);
            setSearchLoading(true);
            setVerses([]);
            setHasMoreAnswers(true);
            setSkip(0);
            timeoutRef = setTimeout(() => {
                setFormValue({
                    search: data.search.value,
                    radioValue: data.radioValue.value,
                });
                setChosenVerses([]);
                actions.setSelectedVerses([]);
                callback(0);
            }, 1000);
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
                        <VerseDisplay val={val} showLength={true} 
                        onSearchInOtherBooks={searchInOtherBooks.bind(this, index, valIndex, val)} key={`${index}_${valIndex}`}/>
                )
            }
        </div>)
    }

    const fetchVersesWrapper = () => {
        setSkip(skip + 1);
        setLoading(true);
        fetchVerses();
    }
    return (
        <div className='d-flex flex-column flex-100 justify-content-center align-content-center'>
            <h6>
                שמך בגימטריה:
                {SPACE}
                {gematri}
            </h6>
            <MyForm fields={freeSearchFormWithButtonsForm}
                    loading={searchLoading}
                    submitText={"חפש"}
                    callback={submit}
            />
            {error && <p>{error}</p>}
            {verses.map((values, index) => {
                return (<div key={`_${index}`} className='marginTop30px'>
                    <Form.Group className='margin15' controlId={`${index}`}>
                        <Form.Check className={`verse-checkbox`} type='radio' value={index}
                                    onChange={(e) => selectedVerse(e, values)}
                                 label={getVersesView(values, index)}
                        />
                        {/* {getVersesView(values, index)} */}
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
