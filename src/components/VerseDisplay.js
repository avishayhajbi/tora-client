import React, { Component, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

import { SPACE, countWeight } from "../utils";
import { VerseLocation } from "../components/VerseLocation";
import { TakenBy } from "../components/TakenBy";
import { AvailableBooks } from "../components/AvailableBooks";

import '../css/verse-display.scss';

export const VerseDisplay = ({ val, showLength, onSearchInOtherBooks, isCartDisplay=false }) => {
  return (
    <div
      className={`text-right ${isCartDisplay ? '': 'verse-box'}`} >
      <p className={`mb-0 fontWeight900 ${val.taken && "disabled-color"}`}> {val.text} </p>
      {/* <ol style={{ ...styles.gray, ...styles.list }}> */}
      <div className="gray list">
        {/* <li> */}
        <VerseLocation
          book={val.book}
          chapter={val.chapter}
          verse={val.verse}
        />
        <hr className="spacer"/>
        {/* </li> */}
        {!isCartDisplay && val.taken && (
          //   <li>
          <TakenBy className="gray" donate={val.donate} bless={val.bless} />
          //   </li>
        )}
        {/* <li> */}
        {/* <AvailableBooks
          className="gray"
          availableBooks={val.availableBooks}
        /> */}
        {/* </li> */}
        {val.bookInfo && <li>{val.bookInfo.address}</li>}
        {showLength && (
          <>
             <span>{`סה״כ אותיות: ${countWeight(val.textWithout)}`}</span>
            <span className="pr-3">{`סה״כ לתשלום: ${countWeight(val.textWithout)} ש״ח`}</span>
          </>
        )}
        {/* </ol> */}
        {!isCartDisplay && (val.taken && val.availableBooks || val.bookInfo && val.availableBooks > 1) && 
            <div className="pt-1">
                <span className="fontWeight900" style={{color: "black"}}>פסוק זה כבר נרכש</span>{' '}
                    <Button onClick={onSearchInOtherBooks}
                        variant="secondary" size="sm">
                    מצא בספרי תורה אחרים
                </Button>
            </div>

            }
      </div>
    </div>
  );
};

// const styles = {
//   verse: {
//     boxShadow: "0px 0px 7px 0px rgba(0, 0, 0, 0.15)",
//     borderRadius: "7px",
//     padding: "10px",
//   },
//   gray: {
//     color: "gray",
//     fontSize: "14px",
//   },
//   list: {
//     listStyleType: "none",
//   },
//   spacer:{
//     margin: "6px 0",
//     color: "#000000",
//     borderColor: "#000000"
//   }
// };
