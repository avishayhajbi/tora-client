import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { getSearchTypes } from "../config";
import { Hello } from "../components/Hello";
import { Progressbar } from "../components/Progressbar";

export const Step3 = ({ nextStep, app }) => {
  const jumpToNextStep = (index) => {
    nextStep({ searchType: index });
  };
  const book = app.selectedBook;

  return (
    <div className="step3 d-flex flex-column flex-100 align-content-center align-items-center text-center height-inherit">
      <div className="position-relative w-100">
        <img src={"/assets/synagogues.png"} alt="Type Image" width="100%" />
        <h2 className="image-text">
          {book.description}
          <br />
          <span className="font14"> {book.address}</span>
        </h2>
      </div>
      <Progressbar
        className="pt-3"
        width={72}
        height={72}
        value={(book.versesAmount / book.totalVerses) * 100}
        isWithText
      />
      <h6 className="paddBottom10px fontWeight900">
        {book.versesAmount.toLocaleString("en-US")} מתוך{" "}
        {book.totalVerses.toLocaleString("en-US")} <br /> פסוקים כבר נרכשו בספר
        תורה זה
      </h6>
      <div className="w-100 sidePadd20px">
      <hr />
      <h2>אשרייכם,</h2>
      <h6>לפניכם מספר אפשרויות לבחירת פסוק עבורך:</h6>
      <div className="pb-4">
        {getSearchTypes().map((val, index) => {
          return (
            // <div className="box" key={`_${val.id}`}>
            <Button
              key={`_${val.id}`}
              variant="secondary"
              className="btn-block"
              onClick={jumpToNextStep.bind(this, val.id)}
              disabled={val.disabled}
            >
              {val.name}
            </Button>
            
            // </div>
          );
        })}
        </div>
    </div>
      </div>

  );
};
