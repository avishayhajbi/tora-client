import React, {Component, useEffect, useState} from "react";
import {Button} from "react-bootstrap";

export const LoadMore = ({callback, show}) => {
    return (
        <React.Fragment>
            {show && <Button variant="outline-secondary" style={style} onClick={callback}>
                הצג עוד תוצאות
            </Button>}
        </React.Fragment>
    )
};

const style = {
    margin: '20px'
}
