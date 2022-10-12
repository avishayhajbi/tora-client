import React, {Component} from "react";
import {Button,} from 'react-bootstrap';
import {getSearchTypes} from "../config";
import {Hello} from "../components/Hello";

export const Step3 = ({nextStep, app}) => {
    const jumpToNextStep = (index) => {
        nextStep({searchType: index});
    }

    return (
        <div
            className='step3 d-flex flex-column flex-100 padd10 justify-content-center align-content-center align-items-center text-center height-inherit'>
            <Hello donate={app.donate}/>
            <h4 className="paddBottom10px">
                לפניך מספר אפשרויות, בחר באפשרות המתאימה להמשך:
            </h4>
            <div className='d-flex flex-row flex-wrap justify-content-around justify-content-center align-content-center align-items-center'>
                {getSearchTypes().map((val, index) => {
                    return (<div className='box' key={`_${val.id}`}>
                        <Button onClick={jumpToNextStep.bind(this, val.id)} disabled={val.disabled}>{val.name}</Button>
                    </div>);
                })}
            </div>
        </div>
    )
};
