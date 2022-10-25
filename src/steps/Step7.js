import React, {Component, useEffect, useState} from "react";
import {Button,} from 'react-bootstrap';
import rest from "../rest";
import {v4 as uuidv4} from 'uuid';
import {loadPaymentScripts, PostNedarim} from '../payment.script';
import {Loader} from "../components/Loader";

// todo: disable the payment after 5 min by server queue
/**
 * save the verses with unique ID in the pending_payments and return the price to the payment provider
 * create a long polling with the generated ID to check if it's done
 */

let MosadId = 0;
let ApiValid = '';
let domain = 'https://1b10-93-173-224-240.ngrok.io';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    MosadId = 0;
    ApiValid = 'j+iyEFN3bE';
} else {
    MosadId = 4000810;
    ApiValid = 'LnUOSuFSPc';
    domain = window.DOMAIN;
}

export const Step7 = ({nextStep, actions, app}) => {
    const [amount, setAmount] = useState(0);
    const selectedVerses = app.selectedVerses;
    const uniqueId = uuidv4();

    useEffect(() => {
        getAmount();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            loadPaymentScripts();
        }, 2500);
    }, [amount]);

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
        // nextStep();
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

    const PayBtClick = () => {
        document.getElementById('Result').innerHTML = ''
        document.getElementById('PayBtDiv').style.display = 'none';
        document.getElementById('OkDiv').style.display = 'none';
        document.getElementById('WaitPay').style.display = 'block';
        document.getElementById('ErrorDiv').innerHTML = '';
        PostNedarim({
            'Name': 'FinishTransaction2',
            'Value': {
                'Mosad': MosadId,
                'ApiValid': ApiValid,
                'PaymentType': 'Ragil',
                'Currency': '1',

                'Zeout':  document.getElementById('Zeout').value,
                'FirstName': app.donate.name,
                'LastName': app.donate.lastName,
                'Street': app.donate.address,
                'City': '',
                'Phone': app.donate.phone,
                'Mail': app.donate.email,

                'Amount': amount,
                'Tashlumim': '1',

                'Groupe': '',
                'Comment': uniqueId,

                'Param1': uniqueId,
                'Param2': '',
                'ForceUpdateMatching': '1', //מיועד לקמפיין אם מעוניינים שהמידע יידחף ליעד, למרות שזה לא נהוג באייפרם

                'CallBack': domain + '/payment', //מיועד לקבלת WEBHOOK לאחר כל עסקה / סירוב
                'CallBackMailError': 'toraletter@gmail.com', //מיועד לקבלת התראה על תקלת בשליחת קאלבק למייל של המפתח במקום למייל של אנשי הקשר של המוסד

                // 'Tokef': document.getElementById('Tokef').value //אם אתם מנהלים את התוקף בדף שלכם (מיועד למי שרוצה להפריד בין חודש לשנה ורוצה לעצב מותאם אישית)

            }
        });
    }

    return (
        <div
            className='step0 d-flex flex-column flex-100 padd10 justify-content-center align-content-center align-items-center  text-center height-inherit'>
            <h1 className="paddBottom10px">
                דף תשלום
            </h1>
            <div className='width100' style={{marginBottom: '150px'}}>
                {amount !== 0 && <React.Fragment>
                    <div
                     style={{
                         "verticalAlign": "top",
                         "textAlign": "right",
                         "margin": "15px 0px 15px 0px",
                         "minWidth":"100%",
                         "-webkitBoxSizing": "border-box",
                     }}>
                    <span
                          style={{
                              "textAlign": "right",
                              "minWidth": "100%",
                              "marginRight": "1px",
                              "color": "#808080",
                          }}>סכום:</span>
                    <br/>
                    <input disabled={true} type="number" name="Amount" style={{
                        color: 'black',
                        width: '-webkit-fill-available',
                        height: '23.5px',
                    }} value={amount} className="TextBox"/>
                </div>
                    <div
                        style={{
                            "verticalAlign": "top",
                            "textAlign": "right",
                            "margin": "15px 0px 15px 0px",
                            "minWidth":"100%",
                            "-webkitBoxSizing": "border-box",
                        }}>
                    <span
                        style={{
                            "textAlign": "right",
                            "minWidth": "100%",
                            "marginRight": "1px",
                            "color": "#808080",
                        }}>תעודת זהות:</span>
                        <br/>
                        <input type="tel" id='Zeout' name="Zeout" style={{
                            color: 'black',
                            width: '-webkit-fill-available',
                            height: '23.5px',
                        }} className="TextBox"/>
                    </div>
                </React.Fragment>}
                <iframe id="NedarimFrame" className='w-100' style={{
                    border: "1px solid",
                }} scrolling="no" src="about:blank"/>
                <div id="WaitNedarimFrame">
                    <Loader/>
                    <br/>Connecting to PCI Server...
                </div>

                <div id="OkDiv"
                     style={{display: 'none'}}
                >
                    העסקה בוצעה בהצלחה
                </div>

                <div id="PayBtDiv" style={{display: 'none'}}>
                    <Button id="PayBt" className="btn" onClick={PayBtClick}>
                        ביצוע תשלום
                    </Button>
                    <div id="ErrorDiv" className='paddTop10px'></div>
                </div>
                <div
                    style={{display: 'none'}}
                    id="WaitPay">
                    <Loader/>
                    <br/>מבצע חיוב, נא להמתין...
                </div>

                <div id="Result"></div>
            </div>
        </div>
    )
};
