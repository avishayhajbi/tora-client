import React, {Component} from "react";
import NextButton from "../components/NextButton";

export const Step1 = ({nextStep}) => {
    return (
        <div className='step1 d-flex flex-column flex-100 padd10 justify-content-center align-content-center align-items-center  text-center height-inherit bg-primary text-white'>
            <h2 className="paddBottom10px">
                אשרייך שזכית!
            </h2>
            <p className="paddBottom10px">
                בקיום המצווה האחרונה מבין תרי”ג מצוות התורה כמו שנאמר
                <br/>
                “ועתה כתבו לכם את השירה הזאת”
                <br/>
                (דברים ל”א, י”ט)
            </p>
            <p className="paddBottom10px list-title">
            חשוב לקרוא לפני:
            </p>
            <ol className="paddBottom10px">
                <li>
                    כל אות עולה שקל אחד אומנם צריך לרכוש פסוק
                </li>
                <li>
                    הפסוק יהיה שלך בלבד ותוכל לרכוש כמה פסוקים שתרצה
                </li>
                <li>
                    יש כמה אופציות לרכישת פסוקים וכל פסוק אפשר לייחד אותו להצלחה, פרנסה, לעילוי נשמת, לרפואה שלימה,
                    לזיווג הגון ולכל הישועות
                </li>
                <li>
                    תוכל להכניס את הפסוק לאיזה ספר תורה שתרצה בהתאם לאפשרויות שינתנו לך
                </li>
            </ol>
            <p className="paddBottom10px">
                בלחיצה המשך אני מתנה בזה שאני שותפ/ה עם כל המשתתפים/ות בספר תורה זו.
            </p>
            <div className="width100">
                <NextButton clicked={nextStep} text={'לחץ למצווה'}/>
            </div>
        </div>
    )
};
