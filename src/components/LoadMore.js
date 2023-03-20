import React, {Component, useEffect, useState} from "react";
import {Button} from "react-bootstrap";

export const LoadMore = ({callback, show}) => {
    return (
        <React.Fragment>
            {show && <Button variant="secondary" style={style} onClick={callback}>
                הצג עוד תוצאות
            </Button>}
        </React.Fragment>
    )
};

const style = {
    marginTop: '20px',
    marginBottom: '30px'
}
