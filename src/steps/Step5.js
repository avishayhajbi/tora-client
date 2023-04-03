import React, {Component, useEffect, useState} from "react";
import NextButton from "../components/NextButton";
import {Hello} from "../components/Hello";
import {Button, Form, Navbar, Alert} from "react-bootstrap";
import {countWeight} from "../utils";
import rest from "../rest";
import {VersesRange} from "../components/VersesRange";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as ICONS from "@fortawesome/free-solid-svg-icons";
import ShoppingCartIcon from "../assets/shopping-cart.svg"
import { VerseLocation } from "../components/VerseLocation";
import { VerseDisplay } from "../components/VerseDisplay";
import Blubird from 'bluebird';

export const Step5 = ({nextStep, app, actions}) => {
    // const [blessFor, setBlessFor] = useState({});
    const [selectedVerses, setSelectedVerses] = useState([]);
    const [toUpdate, setToUpdate] = useState([]);

    useEffect(() => {
        setSelectedVerses(app.selectedVerses);
    }, [])

    useEffect(() => {
        Blubird.map(selectedVerses, async v => {
            return rest.getSelectedVersesPriceAndAmount([v], app.selectedBook)
                .then(res => {
                    console.log(res)
                    v.price = res.price;
                    return res.price;
                })
        }).then((results) => {
            console.log(results);
            if (results && results.length) {
                setToUpdate(results);
            }
        })
    }, [selectedVerses])

    const hasVerseWithoutBless = selectedVerses.some(v => !v.bless?.length);

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

    const updateDonateForValue = (e, val) => {
        if (val.bless) {
            val.bless.forEach(v => {
                v.value = e?.target?.value;
            });
        }
    }

    const getPrice = () => {
        return toUpdate.reduce((a,b)=> a+b,0);
    }

    const nextStepButton = () => {
        if (selectedVerses.length) {
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
        const selectedIds = selectedVerses.map((v) => v._id);
        if (app.cart.find((v) => selectedIds.includes(v._id))) {
            alert("המוצר כבר נמצא בסל");
        } else {
            actions.addToCart(selectedVerses);
            window.location.href = "/1?step=1";
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
            <h2>הוספת פסוקים לעגלת הקניות:</h2>
            <h6 className="text-right">יש לבחור ייעוד לתרומה עבור כל פסוק</h6>
            <ol className='width100 p-0 list-unstyled'>
                {selectedVerses && selectedVerses.map((val, index) => {
                    return <li key={index} className="verse-box mb-4">
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
                        {val?.bless?.length > 0 && <div className='ml-12'>
                            <Form.Group key={val._id + index} className='ml-3' controlId={`${val._id}`}>
                                <Form.Control
                                    type={'text'}
                                    placeholder={"במידה והתרומה בשביל מישהו אחר"}
                                    name={'donate_for'}
                                    value={val.bless.find(v => v.value)?.value}
                                    onChange={(e) => updateDonateForValue(e, val)}
                                />
                            </Form.Group>
                        </div>}
                    </li>
                })}
            </ol>
            <h2 className="pb-4">{`סה״כ לתשלום ${ getPrice() } ש״ח`}</h2>

            <div className="d-flex flex-column width100">
                <NextButton disabled={hasVerseWithoutBless} clicked={addToCart} text={'המשך חיפוש'} variant="primary" block styles={{}}/>
                <NextButton disabled={hasVerseWithoutBless} clicked={nextStepButton} text={'הוסף לעגלה ועבור לתשלום'} variant="secondary" block styles={{}}/>
            </div>
        </div>
    )
};
