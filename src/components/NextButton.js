import React, {Component, useState} from "react";
import {Button} from 'react-bootstrap';

const NextButton = ({disabled, text, clicked, variant='light', block=false}) => {
    return (
            <Button disabled={disabled} style={styles.nextButtonStyle} onClick={clicked} variant={variant} block={block}>
                {text}
            </Button>
    );
}

const styles = {
    nextButtonStyle: {
        marginTop: '20px',
        marginBottom: '20px',
    }
};
export default NextButton;
