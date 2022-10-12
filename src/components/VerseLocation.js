import React, {Component, useEffect, useState} from "react";
import {BooksMap} from "../config";
import {gematriyaNumbers} from "../utils";
import {SPACE} from "../utils";

export const VerseLocation = ({book, chapter, verse}) => {
    return (
        <React.Fragment>
            <span>
                <span>ספר</span>{SPACE}
                <span>{BooksMap[book]}</span>{SPACE}
                <span>פרק</span>{SPACE}
                <span>{gematriyaNumbers(chapter)}</span>{SPACE}
                <span>פסוק</span>{SPACE}
                <span>{gematriyaNumbers(verse)}</span>
            </span>
        </React.Fragment>
    )
};
