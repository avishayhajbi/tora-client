import React, {Component, useState} from "react";
import {Button} from 'react-bootstrap';

const NextButton = ({disabled, text, clicked}) => {
    return (
        <React.Fragment>
            {<Button disabled={disabled} style={styles.nextButtonStyle} onClick={clicked} variant='light'>
                {text}
            </Button>}
        </React.Fragment>
    );
}

const styles = {
    nextButtonStyle: {
        marginTop: '20px',
        marginBottom: '20px',
    }
};
export default NextButton;
