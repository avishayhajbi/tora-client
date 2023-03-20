import React, {Component, useEffect, useState} from "react";
import {VersesRange} from "../components/VersesRange";
import * as ICONS from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import rest from "../rest";
import { VerseDisplay } from "./VerseDisplay";

export const Cart = ({verses, actions}) => {
    const [selectedVerses, setSelectedVerses] = useState([]);
    useEffect(() => {
        setSelectedVerses(verses);
    }, []);

    useEffect(() => {
        updatePrice();
    }, [selectedVerses]);
    useEffect(() => {
        if (!selectedVerses.length) {
            actions.updateModal({
                update: true,
                hideFooter: true,
                buttons: []
            });
        }
    }, [selectedVerses]);

    const updatePrice = () => {
        rest.getSelectedVersesPriceAndAmount(selectedVerses)
            .then(res => {
                const price = res.price || 0;
                if (price !== 0) {
                    actions.updateModal({
                        update: true,
                        hideFooter: false,
                        buttons: [
                            {
                                name: `
                        המשך לרכישה
                        (${price})
                    `,
                                callback: () => {
                                    window.location.href = '/8?step=8';
                                }
                            },
                            {
                                name: 'נקה הכל',
                                callback: () => {
                                    cleanAll(() => {
                                        actions.clearCart();
                                        setSelectedVerses([]);
                                    })
                                }
                            }
                        ]
                    })
                }
            })
            .catch(v => 0);

    }

    const removeItem = (id) => {
        const text = "האם אתה בטוח?";
        if (window.confirm(text) == true) {
            const index = selectedVerses.findIndex(v => v._id === id);
            if (index !== -1) {
                const tmp = [...selectedVerses];
                tmp.splice(index, 1);
                setSelectedVerses(() => tmp);
            }
            actions.removeFromCart(id);
        }
    }

    const cleanAll = (callback) => {
        const text = "האם אתה בטוח?";
        if (window.confirm(text) == true) {
            callback();
        }
    }

    return (
        <React.Fragment>
            {!selectedVerses.length && <h3 className='d-flex'>
                לא נבחרו פסוקים
            </h3>}
            <ol className="list-unstyled p-0">
                {selectedVerses.map((val, index) => {
                    return <li key={val._id}>
                        <div className='marginBottom30px verse-box'>
                            <div className='pointer marginBottom5px' onClick={() => removeItem(val._id)} >
                                <FontAwesomeIcon className='marginLeft5px marginRight5px' icon={ICONS.faTrash}/>
                                <span>
                                    הסר מהעגלה
                                </span>
                            </div>
                            {/* {!val.range && <p>{val.text}</p>} */}
                            {!val.range && <VerseDisplay val={val} showLength isCartDisplay={true}/>}
                            {val.range && <VersesRange val={val} withBook={true}/>}
                            <h6>- {val.bless.map(v => v.name).join(', ')}</h6>
                        </div>
                    </li>
                })}
            </ol>
        </React.Fragment>
    )
};
