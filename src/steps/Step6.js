import React, {Component, useEffect, useState} from "react";
import NextButton from "../components/NextButton";
import {Hello} from "../components/Hello";
import {Form} from "react-bootstrap";
import {Book} from '../components/Book';
import rest from "../rest";

export const Step6 = ({nextStep, app, actions}) => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        rest.getAllBooks()
            .then((res) => {
                setBooks(res.data);
            })
            .catch(() => {
            })
            .finally(() => {

            })
    }, [])


    useEffect(() => {
        setSelectedBook(app.selectedBook);
    }, [])

    const updateSelected = (e, val) => {
        const name = e.target.name;
        const value = e.target.checked;
        setSelectedBook(val)
    }

    const nextStepButton = () => {
        if (selectedBook && selectedBook._id) {
            actions.setSelectedBook(selectedBook);
            nextStep();
        }
    }

    return (
        <div
            className='step6 flex-column flex-100 padd10 justify-content-center align-content-center align-items-center text-center height-inherit'>
            <h3 className='width100'>
                היכן תרצה להכניס את הספר:
            </h3>
            <div className='width100 flex-column flex-wrap justify-content-center align-items-center'>
                {books.map((val, index) => {
                    return (<div key={`_${index}`} className='marginTop30px flex-row'>
                        <Form.Group className='d-flex flex-100 margin15 flex-row' controlId={`${index}`}>
                            <Form.Check className='flex-10 text-center' checked={selectedBook && selectedBook._id === val._id}
                                        type='radio' value={val._id} name={'sameGroup'}
                                        onChange={(e) => updateSelected(e, val)}/>
                            <Form.Label id={`${index}`} className={`flex-90 flex-column text-right`}>
                                <Book {...val}/>
                            </Form.Label>
                        </Form.Group>
                    </div>)
                })}
            </div>
            <div className="stickyFooter width100 marginTop30px">
                <NextButton clicked={nextStepButton} text={'לחץ למצווה'}/>
            </div>
        </div>
    )
};
