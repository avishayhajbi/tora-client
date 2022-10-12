import React, {Component, useEffect, useState} from "react";
import {booksMapHeb, SPACE} from "../utils";

export const VersesRange = ({val, withBook}) => {
    return (
        <React.Fragment>
            {withBook && <div>
                <b>ספר: </b>
                <span className='font-weight-light'>{booksMapHeb[val.book]}</span>
            </div>}
            <div>
                <b>התחלה: </b>
                <span className='font-weight-light'>{val.transformed[0]}</span>
            </div>
            <div>
                <b>סיום: </b>
                <span className='font-weight-light'>{val.transformed[1]}</span>
            </div>
        </React.Fragment>
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
