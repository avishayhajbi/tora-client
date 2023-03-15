import React, {Component, useEffect, useState} from "react";
import NextButton from "../components/NextButton";
import {Hello} from "../components/Hello";
import {Button, Form, Navbar} from "react-bootstrap";
import {countWeight} from "../utils";
import rest from "../rest";
import {VersesRange} from "../components/VersesRange";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as ICONS from "@fortawesome/free-solid-svg-icons";
import ShoppingCartIcon from "../assets/shopping-cart.svg"
import { VerseLocation } from "../components/VerseLocation";
import { VerseDisplay } from "../components/VerseDisplay";

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
                actions.updateModal({
                    show: true,
                    title: 'שים לב',
                    body: 'המוצר כבר נמצא בסל',
                    hideFooter: true,
                });
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
        return <div className='mt-1 text-right'>
            <h6>
                התרומה מיועדת ל:
            </h6>
            <div
                className='d-flex flex-row flex-wrap'>
                {[
                    {name: 'פרנסה'},
                    {name: 'עילוי שם'},
                    {name: 'רפואה שלימה'},
                    {name: 'הצלחה'},
                    {name: 'זיווג הגון'},
                    {name: 'לכל הישועות'},
                ].map((v, vi) => {
                    return (
                        <Form.Group key={vi} className='ml-3' controlId={`${val._id}_${vi}`}>
                            <Form.Check className='text-center myCheckbox custom-checkbox'
                                        checked={val.bless?.find(t => t.name === v.name) ?? ''}
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
            className='step5 d-flex flex-column flex-100 padd20 justify-content-start align-content-center align-items-center text-center height-inherit'>
            {/* <Hello donate={app.donate}/> */}
            <img src={ShoppingCartIcon} alt="Shopping Cart Icon" width="45px"/>
            <h2>סיכום הזמנתכם:</h2>
            <ol className='width100 p-0 list-unstyled'>
                {selectedVerses && selectedVerses.map((val, index) => {
                    return <li key={index} className="verse-box">
                        {/* <Form.Group controlId={'verse'} key={val._id}>
                            <Form.Label className='d-flex flex-row align-content-center align-items-center justify-content-between'>
                                <span className="fontWeight900">אנא בדקו שזהו הפסוק שבחר לבכם:</span>
                                <FontAwesomeIcon onClick={() => removeItem(val._id)} className='pointer marginLeft5px' icon={ICONS.faTrash}/>
                            </Form.Label>
                            <hr className="spacer"/>
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
                        <hr/> */}
                        

                        {/* <Form.Group controlId={'verse'} key={val._id}> */}
                            <div className='d-flex flex-row align-content-center align-items-center justify-content-between'>
                                <span className="fontWeight900">אנא בדקו שזהו הפסוק שבחר לבכם:</span>
                                <FontAwesomeIcon onClick={() => removeItem(val._id)} className='pointer marginLeft5px' icon={ICONS.faTrash}/>
                            </div>
                            <hr className="spacer"/>
                            {!val.range && <VerseDisplay val={val} showLength isCartDisplay={true}/>}
                            {val.range && <VersesRange val={val} withBook={true}/>}
                            <hr className="spacer"/>
                        {/* </Form.Group> */}
                        {getBlessElem(val)}
                        {/* <hr/> */}

                    </li>
                })}
            </ol>
            <h2 className="pb-4">{`סה״כ לתשלום ${'---'} ש״ח`}</h2>

            <div className="d-flex flex-column width100 ">
                <NextButton clicked={addToCart} text={'המשך חיפוש'} variant="primary" block styles={{}}/>
                <NextButton clicked={nextStepButton} text={'תשלום'} variant="secondary" block styles={{}}/>
            </div>
        </div>
    )
};
