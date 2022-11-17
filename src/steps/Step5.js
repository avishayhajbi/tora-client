import React, {Component, useEffect, useState} from "react";
import NextButton from "../components/NextButton";
import {Hello} from "../components/Hello";
import {Button, Form, Navbar} from "react-bootstrap";
import {countWeight} from "../utils";
import rest from "../rest";
import {VersesRange} from "../components/VersesRange";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as ICONS from "@fortawesome/free-solid-svg-icons";

export const Step5 = ({nextStep, app, actions}) => {
    // const [blessFor, setBlessFor] = useState({});
    const [selectedVerses, setSelectedVerses] = useState([]);
    const [toUpdate, setToUpdate] = useState([]);

    useEffect(() => {
        setSelectedVerses(app.selectedVerses);
    }, [selectedVerses])

    useEffect(() => {
        Promise.all(selectedVerses && selectedVerses.filter(v => v.range).map(v => {
            return rest.getSelectedVersesPriceAndAmount([v], app.selectedBook)
                .then(res => {
                    v.price = res.price;
                    return res.price;
                })
        })).then((results) => {
            console.log(results);
            if (results && results.length) {
                setToUpdate(results);
            }
        })
    }, [selectedVerses])

    const updateSelected = (e, v, val) => {
        const name = e.target.name;
        const value = e.target.checked;
        if (!val.bless) {
            val.bless = [];
        }
        if (value === true) {
            val.bless.push(v);
        } else {
            const index = val.bless.findIndex(t => t.name === v.name);
            val.bless.splice(index, 1);
        }
        actions.setSelectedVerses(selectedVerses);
    }

    const nextStepButton = () => {
        const canContinue = selectedVerses.find(v => !v.bless?.length);
        if (!canContinue && selectedVerses.length) {
            const selectedIds = selectedVerses.map(v => v._id);
            if (app.cart.find(v => selectedIds.includes(v._id))) {
                alert('המוצר כבר נמצא בסל');
            } else {
                actions.addToCart(selectedVerses);
                rest.checkAvailability(
                    app.selectedBook._id,
                    selectedVerses.filter(v => !v.range).map(v => v._id),
                    selectedVerses.filter(v => v.range),
                    true,
                )
                    .then(response => {
                        if (response.success) {
                            nextStep();
                        } else if (response.data) {

                        }
                    })
                    .catch(err => {

                    })
            }
        }
    }

    const removeItem = (index) => {
        const text = "האם אתה בטוח?";
        if (window.confirm(text) == true) {
            selectedVerses.splice(index, 1);
            actions.setSelectedVerses(selectedVerses);
            toUpdate.splice(index, 1);
        }
    }

    const addToCart = () => {
        const canContinue = selectedVerses.find(v => !v.bless?.length);
        if (!canContinue) {
            const selectedIds = selectedVerses.map(v => v._id);
            if (app.cart.find(v => selectedIds.includes(v._id))) {
                alert('המוצר כבר נמצא בסל');
            } else {
                actions.addToCart(selectedVerses);
                window.history.back();
            }
        }
    }

    const getBlessElem = (val) => {
        return <div className='width100 marginTop30px flex-column justify-content-center align-content-center align-items-center'>
            <h4>
                התרומה מיועדת ל:
            </h4>
            <div
                className='flex-row flex-wrap justify-content-around form-check-inline justify-content-center align-content-center align-items-center'>
                {[
                    {name: 'פרנסה'},
                    {name: 'עילוי שם'},
                    {name: 'לרפואה שלימה'},
                    {name: 'הצלחה'},
                    {name: 'זיווג הגון'},
                    {name: 'לכל הישועות'},
                ].map((v, vi) => {
                    return (
                        <Form.Group key={vi} className='margin15' controlId={`_${vi}`}>
                            <Form.Check className='text-center myCheckbox'
                                        checked={val.bless?.find(t => t.name === v.name)}
                                        label={v.name} type='checkbox' value={v.name}
                                        name={v.name}
                                        onChange={(e) => updateSelected(e, v, val)}/>
                        </Form.Group>)
                })}
            </div>
        </div>
    }
    return (
        <div
            className='step5 d-flex flex-column flex-100 padd10 justify-content-start align-content-center align-items-center text-center height-inherit'>
            <Hello donate={app.donate}/>

            <ol className='width100'>
                {selectedVerses && selectedVerses.map((val, index) => {
                    return <li key={index}>
                        <Form.Group controlId={'verse'} key={val._id}>
                            <Form.Label className='d-flex flex-row align-content-center align-items-center'>
                                <FontAwesomeIcon onClick={() => removeItem(val._id)} className='pointer marginLeft5px' icon={ICONS.faTrash}/>
                                אנא בדוק שזהו הפסוק שבחר לבך
                            </Form.Label>
                            {!val.range && <Form.Control className='text-center' as='textarea' placeholder={'הפסוק שנבחר'}
                                          value={val.text} name='verse' disabled={true}/>}
                            {val.range && <VersesRange val={val} withBook={true}/>}
                        </Form.Group>
                        {!val.range && <div className='d-flex flex-row layout-align-space-around align-items-center'>
                            <div
                                className='d-flex flex-column justify-content-center align-content-center align-items-center'>
                                <div>
                                    סה"כ אותיות:
                                </div>
                                {<div>{countWeight(val.textWithout)}</div>}
                            </div>
                            <div
                                className='d-flex flex-column justify-content-center align-content-center align-items-center'>
                                <div>סה"כ לתשלום:</div>
                                {<div>₪{countWeight(val.textWithout)}</div>}
                            </div>
                        </div>}
                        {getBlessElem(val)}
                        <hr/>
                    </li>
                })}
            </ol>

            <div className="d-flex flex-row width100 marginTop30px layout-align-space-between">
                <NextButton clicked={nextStepButton} text={'לחץ למצווה'}/>
                <NextButton clicked={addToCart} text={'הוסף לסל והמשך בחיפוש'}/>
            </div>
        </div>
    )
};
