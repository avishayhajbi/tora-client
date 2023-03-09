import React, {Component, useEffect, useState} from "react";
import {SPACE} from "../utils";
import {VerseLocation} from "../components/VerseLocation";
import {TakenBy} from "../components/TakenBy";
import {AvailableBooks} from "../components/AvailableBooks";
import {Form} from "react-bootstrap";

export const VerseDisplay = ({val, showLength}) => {
    return (
        <div style={{boxShadow: "0px 0px 7px 0px rgba(0, 0, 0, 0.15)", borderRadius: "7px", padding: "10px"}}>
            <p className={`${val.taken && 'disabled-color'}`}> {val.text} </p>
            <ol style={{...styles.gray, ...styles.list}}>
                <li><VerseLocation book={val.book} chapter={val.chapter} verse={val.verse}/>
                </li>
                {val.taken && <li><TakenBy style={styles.gray} donate={val.donate} bless={val.bless}/></li>}
                <li><AvailableBooks style={styles.gray} availableBooks={val.availableBooks}/></li>
                {val.bookInfo && <li>{val.bookInfo.address}</li>}
                {showLength && <li>
                    <span>סכום:</span>
                    {SPACE}
                    {val.length}
                </li>}
            </ol>
        </div>
    )
};

const styles = {
    gray: {
        color: 'gray',
        fontSize: '14px',
    },
    list: {
        listStyleType: 'circle'
    }
};
