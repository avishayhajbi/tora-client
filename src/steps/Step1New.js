import React from "react";
import { Button } from "react-bootstrap";
import { BooksCategoriesValues } from "../config";

export const Step1New = ({ nextStep }) => {

  return (
    <div className="step1-new text-center sidePadd20px">
      <p className="paddBottom10px">הסבר קצר על האתר / אפליציה</p>
      <p className="paddBottom10px">
        לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית נולום ארווס סאפיאן -
        פוסיליס קוויס, אקווזמן קולורס מונפרד אדנדום סילקוף, מרגשי ומרגשח. עמחליף
        קולורס מונפרד אדנדום סילקוף, מרגשי ומרגשח. עמחליף ליבם סולגק. בראיט ולחת
        צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק?
      </p>
      {Object.keys(BooksCategoriesValues).map((key, i) => {
        return (
          <Button
            key={key}
            variant="secondary"
            className="btn-block"
            onClick={() => nextStep({category: key})}
          >
            {BooksCategoriesValues[key]}
          </Button>
        );
      })}
    </div>
  );
};
