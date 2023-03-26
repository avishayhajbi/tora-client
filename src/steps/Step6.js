import React, {Component, useEffect, useState} from "react";
import NextButton from "../components/NextButton";
import {Hello} from "../components/Hello";
import {Button, Form} from "react-bootstrap";
import {Book} from "../components/Book";
import rest from "../rest";
import {BookSelect} from "../components/BookSelect";
import {BooksCategoriesKeys, BooksCategoriesSingularValues} from "../config";
import {SPACE} from "../utils";
import {Loader} from "../components/Loader";

export const Step6 = ({nextStep, app, actions, location}) => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [loading, setLoading] = useState(true);

    //TODO: get type by prop/state
    const category = new URLSearchParams(location.search).get('category') ?? BooksCategoriesKeys.synagogues
    useEffect(() => {
        rest
            .getBooksByCategory(category)
            .then((res) => {
                setBooks(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            })
            .finally(() => {
            });
    }, []);

    useEffect(() => {
        setSelectedBook(app.selectedBook);
    }, []);

    const updateSelected = (e, val) => {
        const name = e.target.name;
        const value = e.target.checked;
        setSelectedBook(val);
    };

    const nextStepButton = () => {
        if (selectedBook && selectedBook._id) {
            actions.setSelectedBook(selectedBook);
            nextStep();
        }
    };

    const handleBookSelect = (book) => {
        actions.setSelectedBook(book);
        nextStep();
    };
    const categoryName = BooksCategoriesSingularValues[category];

    const goBack = () => {
        window.history.back();
    }

    return (
        <div
            className="step6 flex-column flex-100 justify-content-center align-content-center align-items-center text-center height-inherit">
            <div className="position-relative">
                <img src={"/assets/synagogues.png"} alt="Type Image" width="100%"/>
                <h2 className="image-text">{categoryName}</h2>
            </div>
            {loading && <div
                className='d-flex flex-column flex-100 layout-align-center-center justify-content-center align-content-center'>
                <Loader/>
            </div>}
            {!loading && <React.Fragment>
                {books.length === 0 && <div className="paddTop10px mx-4 flex-column flex-100 justify-content-center">
                    <p>
                        לא נמצאו ספרים זמינים
                    </p>
                    <p>
                        {SPACE}<Button className='btn' variant="primary" onClick={goBack}>
                        לחצו כדי לחפש שנית
                    </Button>{SPACE}
                    </p>
                </div>}
                {books.length > 0 && <React.Fragment>
                    <h2 className="paddTop20px">בחרו {categoryName}</h2>
                    <p>בחרו {categoryName} בו תרצו לתרום פסוק לספר התורה</p>
                    <div className="text-right">
                        {books.map((val, index) => {
                            return (
                                <div key={val._id} className="mx-4">
                                    <BookSelect
                                        key={`_${index}`}
                                        book={val}
                                        onSelectBook={handleBookSelect}
                                        categoryName={categoryName}
                                    />
                                </div>

                            );
                        })}
                    </div>
                </React.Fragment>}
                {/* <div className="width100 marginTop30px">
        <NextButton clicked={nextStepButton} text={"לחץ למצווה"} />
      </div> */}
            </React.Fragment>}
        </div>
    );
};
