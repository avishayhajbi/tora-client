import React, { Component, useEffect, useState } from "react";
import NextButton from "../components/NextButton";
import { Hello } from "../components/Hello";
import { Button, Form } from "react-bootstrap";
import { Book } from "../components/Book";
import rest from "../rest";
import { BookSelect } from "../components/BookSelect";

export const Step6 = ({ nextStep, app, actions }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  //TODO: get type by prop/state
  const type = "synagogues";
  useEffect(() => {
    rest
      .getAllBooks()
      .then((res) => {
        // setBooks(res.data);
        setBooks(Array(12).fill(res.data[0]));
      })
      .catch(() => {})
      .finally(() => {});
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

  return (
    <div className="step6 flex-column flex-100 justify-content-center align-content-center align-items-center text-center height-inherit">
      <div className="position-relative">
        <img src={"/assets/synagogues.png"} alt="Type Image" width="100%" />
        <h2 className="image-text">בתי כנסת</h2>
      </div>
      <h2 className="paddTop20px">בחרו בית כנסת</h2>
      <p>בחרו בית כנסת בו תרצו לתרום פסוק לספר התורה</p>
      <div className="text-right">
        {books.map((val, index) => {
          return (
            // <div key={`_${index}`} className='marginTop30px flex-row'>
            //     <Form.Group className='d-flex flex-100 margin15 flex-row' controlId={`${index}`}>
            //         <Form.Check className='flex-10 text-center' checked={selectedBook && selectedBook._id === val._id}
            //                     type='radio' value={val._id} name={'sameGroup'}
            //                     onChange={(e) => updateSelected(e, val)}/>
            //         <Form.Label id={`${index}`} className={`flex-90 flex-column text-right`}>
            //             <Book {...val}/>
            //         </Form.Label>
            //     </Form.Group>
            // </div>
            <BookSelect
              key={`_${index}`}
              book={val}
              onSelectBook={handleBookSelect}
            />
          );
        })}
      </div>
      {/* <div className="width100 marginTop30px">
        <NextButton clicked={nextStepButton} text={"לחץ למצווה"} />
      </div> */}
    </div>
  );
};
