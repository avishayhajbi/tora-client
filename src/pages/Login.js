import React, { Component } from "react";
import {bindActionCreators} from 'redux';
import * as app_actions from '../store/app/actions';
import "../css/Login.css";
import Form from '../components/Form'
import {getLoginForm} from '../config';
import rest from '../rest';
import {connect} from "react-redux";
import $ from 'jquery';

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    submit(fields){
        this.setState({loading: true});
        let toS = {
            user:fields.user.value,
            password:fields.password.value,
        }
        rest.login(toS)
            .then((data)=>{
                return {token: data.token};
            })
            .then(this.props.actions.login)
            .then(()=>{
                let { history } = this.props;
                history.replace({pathname: '/management'});
            })
            .catch((err)=>{
                console.error(err.message);
            })
            .finally(()=>{
                this.setState({loading: false});
            })
    }

    render () {
        return (
            <div className={'page flex-100'}>
                <h3 className="loginTitle display-flex flex justify-content-center align-content-center width100 padd15px">
                    ממשק מנהל
                </h3>
                <div className='flex-100 padd15'>
                <Form fields={getLoginForm()} callback={this.submit.bind(this)} loading={this.state.loading}
                      forgetPass={true} history={this.props.history} hidePolicy={true} submitText={"התחבר"}
                />
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);

