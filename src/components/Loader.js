import React, {Component, useEffect, useState} from "react";
import Spinner from "react-bootstrap/Spinner";

export const Loader = ({callback}) => {
    return (
        <React.Fragment>
            <Spinner animation="border" style={style}/>
        </React.Fragment>
    )
};

const style = {
    margin: '10px'
}
