//שימו לב!! שיטת הפוסטמסג' לא עובדת בשרת מקומי (localhost). חובה להעלות את הקוד שלכם לדומיין שלכם.

window.onerror = function (msg, url, line, col, error) {
    alert("שגיאת תוכנה. פנה לתמיכה טכנית. שגיאה: " + msg)
}

//זהירות! את השורת קוד הזו יש להפעיל רק פעם אחת בעת פתיחת הדף
window.onload = function () {
    // if (window.addEventListener) { window.addEventListener("message", ReadPostMessage, false); } else { window.attachEvent("onmessage", ReadPostMessage); }
    // document.getElementById('NedarimFrame').onload = function () { console.log('StartNedarim'); PostNedarim({'Name':'GetHeight'}) }
    // document.getElementById('NedarimFrame').src = "https://matara.pro/nedarimplus/iframe?language=he";
}
export function loadPaymentScripts() {
    if (window.addEventListener) { window.addEventListener("message", ReadPostMessage, false); } else { window.attachEvent("onmessage", ReadPostMessage); }
    document.getElementById('NedarimFrame').onload = function () { /*console.log('StartNedarim'); */PostNedarim({'Name':'GetHeight'}) }
    document.getElementById('NedarimFrame').src = "https://matara.pro/nedarimplus/iframe?language=he&Captcha=1";
    document.getElementById('PayBtDiv').style.display = 'block';


}
///////////////////////////////

export function PostNedarim(Data) { var iframeWin = document.getElementById('NedarimFrame').contentWindow; iframeWin.postMessage(Data, "*"); };
function ReadPostMessage(event) {
    // console.log(event.data);
    switch (event.data.Name) {
        case 'Height':
            //Here you get the height of iframe | event.data.Value
            document.getElementById('NedarimFrame').style.height = (parseInt(event.data.Value) + 15) + "px";
            document.getElementById('WaitNedarimFrame').style.display = 'none';
            break;

        case 'TransactionResponse':
            // document.getElementById('Result').innerHTML = '<b>TransactionResponse:<br/>' + JSON.stringify(event.data.Value) + '</b><br/>see full data in console';
            console.log(event.data.Value)
            if (event.data.Value.Status == 'Error') {
                document.getElementById('ErrorDiv').innerHTML = event.data.Value.Message
                document.getElementById('WaitPay').style.display = 'none';
                document.getElementById('PayBtDiv').style.display = 'block';
            } else {
                document.getElementById('WaitPay').style.display = 'none';
                document.getElementById('OkDiv').style.display = 'block';
            }
    }
}
function PayBtClick() {
    document.getElementById('Result').innerHTML = ''
    document.getElementById('PayBtDiv').style.display = 'none';
    document.getElementById('OkDiv').style.display = 'none';
    document.getElementById('WaitPay').style.display = 'block';
    document.getElementById('ErrorDiv').innerHTML = '';
    PostNedarim({
        'Name': 'FinishTransaction2',
        'Value': {
            'Mosad': document.getElementById('MosadId').value,
            'ApiValid': document.getElementById('ApiValid').value,
            'PaymentType': document.getElementById("PaymentType").value,
            'Currency': '1',

            'Zeout': '',
            'FirstName': document.getElementById('ClientName').value,
            'LastName': '',
            'Street': document.getElementById('Street').value,
            'City': document.getElementById('City').value,
            'Phone': '',
            'Mail': '',

            'Amount': document.getElementById('Amount').value,
            'Tashlumim': '1',

            'Groupe': '',
            'Comment': 'בדיקת אייפרם 2',

            'Param1': 'פרמטר 1',
            'Param2': '',
            'ForceUpdateMatching': '1', //מיועד לקמפיין אם מעוניינים שהמידע יידחף ליעד, למרות שזה לא נהוג באייפרם

            'CallBack': '', //מיועד לקבלת WEBHOOK לאחר כל עסקה / סירוב
            'CallBackMailError': '', //מיועד לקבלת התראה על תקלת בשליחת קאלבק למייל של המפתח במקום למייל של אנשי הקשר של המוסד

            'Tokef': document.getElementById('Tokef').value //אם אתם מנהלים את התוקף בדף שלכם (מיועד למי שרוצה להפריד בין חודש לשנה ורוצה לעצב מותאם אישית)

        }
    });
}
