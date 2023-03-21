import React, {Component, useEffect, useState} from "react";
import {VersesRange} from "../components/VersesRange";
import * as ICONS from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import rest from "../rest";
import { VerseDisplay } from "./VerseDisplay";
import Modal from '../components/Modal';

const removeItemModalDefaultState ={ isShow:false, id: null};

export const Cart = ({verses, actions}) => {
    const [selectedVerses, setSelectedVerses] = useState([]);
    const [removeItemModal, setRemoveItemModal] = useState(removeItemModalDefaultState);
    const [showRemoveAllModal, setShowRemoveAllModal] = useState(false);

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
                                    window.location.href = '/7?step=7';
                                }
                            },
                            {
                                name: 'נקה הכל',
                                callback:() => setShowRemoveAllModal(true)
                                // callback: () => {
                                //     cleanAll(() => {
                                //         actions.clearCart();
                                //         setSelectedVerses([]);
                                //     })
                                // }
                            }
                        ]
                    })
                }
            })
            .catch(v => 0);

    }

    const removeItem = (id) => {
        // const text = "האם אתה בטוח?";

        // if (window.confirm(text) == true) {
            const index = selectedVerses.findIndex(v => v._id === id);
            if (index !== -1) {
                const tmp = [...selectedVerses];
                tmp.splice(index, 1);
                setSelectedVerses(() => tmp);
            }
            actions.removeFromCart(id);
        // }
    }

    // const cleanAll = (callback) => {
    //     const text = "האם אתה בטוח?";
    //     if (window.confirm(text) == true) {
    //         callback();
    //     }
    // }

    return (
        <React.Fragment>
            { (removeItemModal.isShow || showRemoveAllModal) &&  <div className="fade modal-backdrop show"></div>}
            {!selectedVerses.length && <h3 className='d-flex'>
                לא נבחרו פסוקים
            </h3>}
            <ol className="list-unstyled p-0">
                {selectedVerses.map((val, index) => {
                    return <li key={val._id}>
                        <div className='marginBottom30px verse-box'>
                            <div className='pointer marginBottom5px' onClick={() => setRemoveItemModal({isShow:true, id: val._id})} >
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

             <Modal
                show={removeItemModal.isShow}
                onHide={()=> setRemoveItemModal(removeItemModalDefaultState)}
                onClose={()=> setRemoveItemModal(removeItemModalDefaultState)}
                title={'הסרת פריט מהעגלה'}
                body={'האם להסיר את הפריט?'}
                buttons={[
                    {
                        name: 'אישור',
                        callback: () => {
                            removeItem(removeItemModal.id);
                            setRemoveItemModal(removeItemModalDefaultState);
                        }
                    },
                    {
                        name: 'ביטול'
                    }
                ]}
              />

            <Modal
                show={showRemoveAllModal}
                onHide={()=> setShowRemoveAllModal(false)}
                onClose={()=> setShowRemoveAllModal(false)}
                title={'הסרת פריטים מהעגלה'}
                body={'האם להסיר את כל הפריטים?'}
                buttons={[
                    {
                        name: 'אישור',
                        callback: () => {
                            actions.clearCart();
                            setSelectedVerses([]);
                            setShowRemoveAllModal(false)
                        }
                    },
                    {
                        name: 'ביטול'
                    }
                ]}
              />
        </React.Fragment>
    )
};
