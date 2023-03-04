import React, {Component, useEffect, useState} from "react";
import NextButton from "../components/NextButton";
import {Hello} from "../components/Hello";
import {SearchTypes} from "../config";
import {countWeight} from "../utils";
import {FirstAndLastLetter} from "../searches/FirstAndLastLetter";
import {FreeSearch} from "../searches/FreeSearch";
import {VerseYourName} from "../searches/VerseYourName";
import {Gematria} from "../searches/Gematria";
import {AmountSearch} from "../searches/AmountSearch";
import {RandomSearch} from "../searches/RandomSearch";
import MyList from "../components/List";
import {ByDate} from "../searches/ByDate";
import {Aliya} from "../searches/Aliya";
import rest from '../rest';

export const Step4 = ({nextStep, app, location, actions}) => {
    const [searchType, setSearchType] = useState(-1);
    const [versesSelected, setVersesSelected] = useState(0);
    const [reachedToBottom, setReachedToBottom] = useState(false);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchType(params.get('searchType'));
    }, []);
    useEffect(() => {
        if (!app.donate.name) {
            console.log('bad access');
        }
    }, [])
    useEffect(() => {
        getTotalAmount();
    }, [versesSelected])

    const getSelectedSearchType = () => {
        switch (searchType) {
            case SearchTypes.firstAndLastLetter: {
                return <FirstAndLastLetter searchType={SearchTypes.firstAndLastLetter} donate={app.donate}
                                           book={app.selectedBook} callback={canContinue} actions={actions}
                                           reachedToBottom={reachedToBottom}/>
            }
            case SearchTypes.freeSearch: {
                return <FreeSearch searchType={SearchTypes.freeSearch} donate={app.donate} book={app.selectedBook}
                                   callback={canContinue} actions={actions} reachedToBottom={reachedToBottom}/>
            }
            case SearchTypes.verseYourName: {
                return <VerseYourName searchType={SearchTypes.verseYourName} donate={app.donate} book={app.selectedBook}
                                      callback={canContinue} actions={actions} reachedToBottom={reachedToBottom}/>
            }
            case SearchTypes.gematria: {
                return <Gematria searchType={SearchTypes.gematria} donate={app.donate} book={app.selectedBook}
                                 callback={canContinue} actions={actions} reachedToBottom={reachedToBottom}/>
            }
            case SearchTypes.amount: {
                return <AmountSearch searchType={SearchTypes.amount} donate={app.donate} book={app.selectedBook}
                                     callback={canContinue} actions={actions} reachedToBottom={reachedToBottom}/>
            }
            case SearchTypes.random: {
                return <RandomSearch searchType={SearchTypes.random} donate={app.donate} book={app.selectedBook}
                                     callback={canContinue} actions={actions} reachedToBottom={reachedToBottom}/>
            }
            case SearchTypes.byDate: {
                return <ByDate searchType={SearchTypes.byDate} donate={app.donate} book={app.selectedBook}
                                     callback={canContinue} actions={actions} reachedToBottom={reachedToBottom}/>
            }
            case SearchTypes.aliya: {
                return <Aliya searchType={SearchTypes.aliya} donate={app.donate} book={app.selectedBook}
                                     callback={canContinue} actions={actions} reachedToBottom={reachedToBottom}/>
            }
            default:
                return <div>חיפוש לא קיים</div>
        }
    }

    const canContinue = (can) => {
        setVersesSelected(can);
    }

    const nextStepButton = () => {
        if (versesSelected) {
            nextStep();
        }
    }

    const getTotalAmount = () => {
        rest.getSelectedVersesPriceAndAmount(app.selectedVerses)
            .then(res => {
                setAmount(res.price);
            })
        // let amount = 0;
        // app.selectedVerses.map(val => {
            // amount += countWeight(val.textWithout)
        // });
        // return amount;
    }

    const reachedBottom = (status) => {
        setReachedToBottom(status);
    }

    return (
        <div
            className='step4 flex-column flex-100 padd10 justify-content-center align-content-center align-items-center text-center height-inherit'>
            <div
                className='d-flex flex-wrap justify-content-around justify-content-center align-content-center align-items-center'>
                {/*<MyList callback={reachedBottom}>*/}
                    {getSelectedSearchType()}
                {/*</MyList>*/}
            </div>
            <div className="stickyFooter totalToPay width100">
                <div className='d-flex flex-row layout-align-space-around align-items-center'>
                    <div
                        className='d-flex flex-column justify-content-center align-content-center align-items-center'>
                        <div>
                            סה"כ אותיות:
                        </div>
                        {<div>{amount}</div>}
                    </div>
                    <div className='d-flex flex-column justify-content-center align-content-center align-items-center'>
                        <div>סה"כ לתשלום:</div>
                        {<div>₪{amount}</div>}
                    </div>
                    <NextButton disabled={versesSelected === 0} clicked={nextStepButton} text={'לחץ למצווה'}/>
                </div>
            </div>
        </div>
    )
};
