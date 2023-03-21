import React, {Component, useEffect} from "react";
import rest from "../rest";

export const Step8 = ({history, app, actions}) => {
    useEffect(() => {
        const donate = app.donate;
        const verses = app.selectedVerses;
        const selectedBook = app.selectedBook._id;
        if (verses.length) {
            setTimeout(() => {
                actions.clearAll();
                actions.resetAppData();
            }, 1500);
        }
    }, []);

    return (
        <div
            className='step0 d-flex flex-column flex-100 padd10 justify-content-center align-content-center align-items-center  text-center height-inherit'>
            <h1 className="paddBottom10px">
                תודה רבה על תרומתך
            </h1>
        </div>
    )
};
