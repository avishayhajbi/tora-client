import React, {Component, useRef, useState} from "react";
import NextButton from "../components/NextButton";
import {getDonateForm, getContributionForm} from "../config";
import Form from "../components/Form";

export const Step2 = ({nextStep, actions, app}) => {
    const [formData, setFormData] = useState({});
    const donateForm = getDonateForm();
    const contributionForm = getContributionForm();
    const inputEl1 = useRef(null);
    const inputEl2 = useRef(null);
    if (app.donate) {
        Object.keys(donateForm).forEach(k => donateForm[k].value = app.donate[k]);
        Object.keys(contributionForm).forEach(k => contributionForm[k].value = app.donate[k]);
    }

    const submit = (data) => {
        setFormData({...data, ...{contribution: (formData.contribution || {})}});
        const toSave = {};
        Object.keys(data).forEach(k => {
            toSave[k] = data[k].value;
        });
        actions.updateDonate({...app.donate, ...toSave});
    }

    const contributionSubmit = (data) => {
        setFormData({...formData, contribution: data});
        const toSave = {};
        Object.keys(data).forEach(k => {
            toSave[k] = data[k].value;
        });
        actions.updateDonate({...app.donate, ...toSave});
    }

    const nextStepButton = () => {
        if (formData.valid) {
            if (formData?.donateForSomeoneElse?.value && formData.contribution?.valid) {
                nextStep();
            } else if (!formData?.donateForSomeoneElse?.value) {
                nextStep();
            } else {
                try {inputEl2.current.reportValidity();} catch(err) {}
            }
        } else {
            try {inputEl1.current.reportValidity();} catch(err) {}
        }
    }

    return (
        <div className={`step2 flex-column flex-100 padd10 justify-content-center align-content-center text-center height-inherit`}>
            <h4 className={"paddBottom10px"}>
                פרטים אישיים לפני שנמשיך
            </h4>
            <div>
                <h5>פרטי התורם:</h5>
                <Form fields={donateForm}
                      everyChangeUpdate={true}
                      submitText={""}
                      callback={submit}
                reff={inputEl1}/>
            </div>
            {formData?.donateForSomeoneElse?.value && <div>
                <h5>קיום התרומה של שם:</h5>
                <Form fields={contributionForm}
                      everyChangeUpdate={true}
                      submitText={""}
                      callback={contributionSubmit}
                reff={inputEl2}/>
            </div>}
            <div className="width100">
                <NextButton clicked={nextStepButton} text={'לחץ למצווה'}/>
            </div>
        </div>
    )
};
