import React, {Component, useState} from "react";
import {Button} from 'react-bootstrap';

const btnStyles = {
        marginTop: '20px',
        marginBottom: '20px',
};

const NextButton = ({disabled, text, clicked, variant='light', block=false, styles={...btnStyles}}) => {
    return (
            <Button disabled={disabled} style={styles} onClick={clicked} variant={variant} block={block}>
                {text}
            </Button>
    );
}


export default NextButton;
