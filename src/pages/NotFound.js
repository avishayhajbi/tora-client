import React, { Component } from "react";
import '../css/404.scss';

class Register extends Component {
    constructor (props) {
        super(props);
        this.state = {

        }

    }

    render () {
        return (
            <div className='page404 flex-100 flex-column padd10 justify-content-center align-content-center align-items-center text-center height-inherit' style={{width: '95%'}}>
               <h1>404</h1>
                <br/>
               <h3>הדף לא נמצא</h3>
            </div>
        )
    }
}
export default Register;
