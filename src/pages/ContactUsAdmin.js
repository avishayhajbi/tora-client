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
import {Button} from "react-bootstrap";

class ContactUsAdmin extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            messages: [],
        }
    }

    componentDidMount() {
        this.getMessages();
    }

    getMessages() {
        rest.getContactUs()
            .then(response => {
                this.setState({messages: response?.data});
            })
    }

    markAsRead(msg) {
        rest.updateContactUs(msg)
            .then(response => {
                const oldState = this.state.messages;
                const index = oldState.findIndex(v => v._id === msg._id);
                if (index !== -1) {
                    oldState[index].read = true;
                    this.setState({messages: oldState});
                }
            })
    }

    render () {
        return (
            <div className={'page flex-100'}>
                <h3 className="loginTitle display-flex flex justify-content-center align-content-center width100 padd15px">
                    הודעות צור קשר
                </h3>
                <div className='flex-100 padd15'>
                    {this.state.messages.map(msg => {
                        return <div key={msg._id} className={`text-right verse-box marginTop30px`}>
                            <p className={`mb-0 fontWeight900`}>
                                שם:
                                {msg.name}
                            </p>
                            <p className={`mb-0 fontWeight900`}>
                                טלפון:
                                {msg.tel}
                            </p>
                            <p className={`mb-0 fontWeight900`}>
                                אימייל:
                                {msg.email}
                            </p>
                            <p className={`mb-0 fontWeight900`}>
                                הודעה:
                                {msg.message}
                            </p>
                            {!msg.read && <Button variant="secondary" className='marginTop10px' onClick={() => this.markAsRead(msg)}>
                                סמן כנקרא
                            </Button>}
                        </div>
                    })}
                </div>

            </div>
        )
    }
}

export default ContactUsAdmin

