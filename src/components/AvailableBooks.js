import React, {Component, useEffect, useState} from "react";
import {SPACE} from "../utils";

export const AvailableBooks = ({availableBooks}) => {
    return (
        <React.Fragment>
            <div>
                <span>זמין ב</span>{SPACE}
                <span>{availableBooks}</span>{SPACE}
                <span>ספרי תורה</span>
            </div>
        </React.Fragment>
    )
};
