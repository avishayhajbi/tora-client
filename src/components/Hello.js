import React, {Component, useEffect, useState} from "react";

export const Hello = ({donate}) => {
    return (
        <React.Fragment>
            {donate && <h3 className="paddBottom10px">
                הצדיק {donate.contributionName || donate.name || '(לא נבחר שם)'} {donate.contributionLastName || donate.lastName || ''}
            </h3>}
        </React.Fragment>
    )
};
