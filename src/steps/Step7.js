import React, {Component, useEffect, useState} from "react";
import {Button,} from 'react-bootstrap';
import {countWeight} from "../utils";
import rest from "../rest";
import {v4 as uuidv4} from 'uuid';

// todo: disable the payment after 5 min by server queue
/**
 * save the verses with unique ID in the pending_payments and return the price to the payment provider
 * create a long polling with the generated ID to check if it's done
 */
export const Step7 = ({nextStep, actions, app}) => {
    const [amount, setAmount] = useState(0);
    const selectedVerses = app.selectedVerses;
    const uniqueId = uuidv4();

    useEffect(() => {
        getAmount();
    }, []);

    useEffect(() => {
        rest.updateBuyingVerses({
            donate: app.donate,
            selectedBook: app.selectedBook,
            verses: selectedVerses.filter(v => !v.range),
            ranges: selectedVerses.filter(v => v.range),
            checkout: uniqueId,
        })
            .then(response => {
                checkPaymentStatus(uniqueId)
            })
    }, [amount]);

    const checkPaymentStatus = (id) => {
        rest.checkIFPaymentIsDone(id)
            .then((response) => {
                if (response && response.success) {
                    payed();
                } else {
                    setTimeout(() => {
                        checkPaymentStatus(id);
                    }, 1000 * 10);
                }
            })
    }
    const payed = () => {
        nextStep();
    }

    const getAmount = () => {
        rest.checkAvailability(
            app.selectedBook._id,
            selectedVerses.filter(v => !v.range).map(v => v._id),
            selectedVerses.filter(v => v.range),
            true,
        )
            .then(response => {
                if (response.success) {
                    rest.getSelectedVersesPriceAndAmount(selectedVerses, app.selectedBook/*, uniqueId*/)
                        .then(res => {
                            setAmount(res.price);
                        })
                } else {
                    setAmount(0);
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    return (
        <div
            className='step0 d-flex flex-column flex-100 padd10 justify-content-center align-content-center align-items-center  text-center height-inherit'>
            <h1 className="paddBottom10px">
                דף תשלום
            </h1>
            {amount !== 0 && <Button onClick={payed}>{amount} שלם </Button>}
        </div>
    )
};
