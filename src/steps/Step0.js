import React, {Component, useEffect} from "react";
import HeaderIcon from "../assets/header-icon.svg"
import NextButton from "../components/NextButton";

export const Step0 = ({nextStep, actions}) => {
    return (
      <div className="step0 d-flex flex-column flex-100 padd10 justify-content-center align-content-center align-items-center  text-center height-inherit bg-primary text-white">
        <img src={HeaderIcon} alt="Header Icon" onClick={nextStep} className="pointer"/>
        <h2 className="paddBottom10px">מעלות כתיבת אות בספר תורה</h2>
        <p className="paddBottom10px">
          ב"י בדעת הטור: גם בזמן הזה יש מצווה דאורייתא בכתיבת ספר תורה... (יו"ד
          ער ד"ה וכתב)
        </p>
        <p className="paddBottom10px">
          ...לעת עתה מצוה הבאה לידך אל תחמיצנה ועדיף להזדרז במצוה זו להשתתף עם
          אחרים לרכוש הס"ת המהודר, ולא להמתין עד שיהיה בידו את כל הסכום הדרוש
          עבור ס"ת מהודר שיוכל לקנותו לבדו כי לא ידע אדם מה ילד יום...
        </p>
        <p className="paddBottom10px">
          (שו"ת עטרת פז חלק א כרך ב - יורה דעה סימן יב)
        </p>
        <div className="width100">
          <NextButton clicked={nextStep} text={"לחץ למצווה"} />
        </div>
      </div>
    );
};
