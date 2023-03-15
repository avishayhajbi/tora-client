import React, {Component, useEffect, useRef, useState} from "react";
import NextButton from "../components/NextButton";
import {getDonateForm} from "../config";
import Form from "../components/Form";

export const Step2 = ({nextStep, actions, app}) => {
    const [formData, setFormData] = useState({});
    const donateForm = getDonateForm();
    const inputEl1 = useRef(null);
    if (app.donate) {
        Object.keys(donateForm).forEach(k => donateForm[k].value = app.donate[k]);
    }

    const submit = (data) => {
        setFormData({...data, ...{contribution: (formData || {})}});
        const toSave = {};
        Object.keys(data).forEach(k => {
            toSave[k] = data[k].value;
        });
        actions.updateDonate({...app.donate, ...toSave});
    }

    const nextStepButton = () => {
        if (formData.valid) {
            nextStep();
        } else {
            try {inputEl1.current.reportValidity();} catch(err) {}
        }
    }

    return (
      <div
        className={`step2 flex-column flex-100 padd20 justify-content-center align-content-center text-center height-inherit`}
      >
        <h2>פרטים אישיים לפני שנמשיך... </h2>
          <Form
            fields={donateForm}
            everyChangeUpdate={true}
            submitText={""}
            callback={submit}
            triggerSubmitOnCreate={true}
            reff={inputEl1}
          />
        <div className="width100">
          <NextButton clicked={nextStepButton} text="שליחה" variant="secondary" block/>
        </div>
      </div>
    );
};
