import React, { Component } from "react";
import {bindActionCreators} from 'redux';
import * as app_actions from '../store/app/actions';
import "../css/Login.css";
import Form from '../components/Form'
import {getContactForm} from '../config';
import rest from '../rest';
import {connect} from "react-redux";
import $ from 'jquery';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as ICONS from "@fortawesome/free-solid-svg-icons";

class ContactUs extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    submit(fields){
        const obj = {};
        Object.keys(fields).forEach(key => {
            obj[key] = fields[key].value;
        })
        if (JSON.stringify(this.obj) !== JSON.stringify(obj)) {
            this.obj = obj;
            rest.sendContactUs(obj)
                .then(() => {
                    this.props.actions.updateModal({
                        show: true,
                        title: 'אישור',
                        body: 'ההודעה נשלחה בהצלחה',
                        hideFooter: true,
                    });
                })
                .catch(() => {
                    this.props.actions.updateModal({
                        show: true,
                        title: 'שגיאה',
                        body: 'ההודעה לא נשלחה',
                        hideFooter: true,
                    });
                })
        }
    }

    render () {
        return (
            <div className={'page flex-100'}>
                <h3 className="loginTitle display-flex flex justify-content-center align-content-center width100 padd15px">
                    צור קשר
                </h3>
                <div className='flex-100 padd15'>
                    <Form fields={getContactForm()} callback={this.submit.bind(this)} loading={this.state.loading}
                          hidePolicy={true} submitText={"שלח"} removeSearchIcon={true}
                    />
                </div>
                <h4 className='flex-100 padd15'>
                    <a href='tel:03-7788777'>
                        <FontAwesomeIcon
                            className="marginLeft5px"
                            icon={ICONS.faPhone}
                            color={"black"}
                        ></FontAwesomeIcon>
                        צור קשר -
                        03-7788777
                    </a>
                </h4>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    const creators = app_actions; // [].concat.apply([],actions).filter(value => typeof value === 'function');

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);

