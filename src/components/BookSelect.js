import React from "react";
import { Button, ProgressBar } from "react-bootstrap";
import "../css/book-select.scss";
import { Progressbar } from "./Progressbar";

export const BookSelect = ({ book, selectBtnLabel = "בחירה", onSelectBook, categoryName }) => {

  return (
    <div className="mt-3 d-flex book-select pointer"  onClick={() => onSelectBook(book)} >
      <Progressbar
        width={30}
        height={30}
        value={(book.versesAmount / book.totalVerses) * 100}
        className='pr-2'
      />
      <div className="d-flex flex-column fontWeight900 details">
        <span>{categoryName} {book.description}</span>
        <span className="address">{book.address}</span>
      </div>
      <Button variant="secondary mr-auto">{selectBtnLabel}</Button>
    </div>
  );
};
