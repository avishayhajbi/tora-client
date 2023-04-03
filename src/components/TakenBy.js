import React, {Component, useEffect, useState} from "react";
import {SPACE} from "../utils";

export const TakenBy = ({donate, bless}) => {
    return (
        <React.Fragment>
            <div>
                {donate && donate.name && <React.Fragment>
                    <span>נקנה על ידי:</span>{SPACE}<span>{donate?.name}</span>{SPACE}
                </React.Fragment>}
                {bless && <React.Fragment>
                    <span>ל:</span>{SPACE}
                    <span>{bless.map(v => v.name).join(', ')}</span>{SPACE}
                    <span>{bless.find(v => v.value)?.value}</span>
                </React.Fragment>}
            </div>
        </React.Fragment>
    )
};
