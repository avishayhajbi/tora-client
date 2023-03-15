import React, {Component} from "react";
import {bindActionCreators} from 'redux';
import '../css/home.scss';
import * as app_actions from '../store/app/actions';
import {Step0} from "../steps/Step0";
import {Step1New} from "../steps/Step1New";
import {Step1} from "../steps/Step1";
import {Step2} from "../steps/Step2";
import {Step3} from "../steps/Step3";
import {Step4} from "../steps/Step4";
import {Step5} from "../steps/Step5";
import {Step6} from "../steps/Step6";
import {Step7} from "../steps/Step7";
import {Step8} from "../steps/Step8";

import {connect} from "react-redux";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currStep: 0,
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        const step = new URLSearchParams(this.props.location.search).get("step");
        if (step) {
            this.setState({currStep: Number(step)});
        }
    }

    componentWillUnmount() {

    }

    nextStep(data = {}) {
        let {history} = this.props;
        const step = this.state.currStep + 1;
        let search = `?step=${step}`;
        if (data.hasOwnProperty('searchType')) {
            search += `&searchType=${data.searchType}`;
        }
        const category = data.category ?? new URLSearchParams(this.props.location.search).get('category');
        if (category) {
            search += `&category=${category}`;
        }
        history.push({
            pathname: `/${step}`,
            search: search,
            state: {step, searchType: data.searchType},
        });
    }

    renderSteps() {
        const step = this.state.currStep;
        switch(step) {
            case 0: return <Step0 nextStep={this.nextStep.bind(this)} {...this.props}/>;
            case 1: return <Step1New nextStep={this.nextStep.bind(this)} {...this.props}/>;
            case 2: return <Step1 nextStep={this.nextStep.bind(this)} {...this.props}/>;
            case 3: return <Step6 nextStep={this.nextStep.bind(this)} {...this.props}/>;
            case 4: return <Step3 nextStep={this.nextStep.bind(this)} {...this.props}/>;
            case 5: return <Step4 nextStep={this.nextStep.bind(this)} {...this.props}/>;
            case 6: return <Step2 nextStep={this.nextStep.bind(this)} {...this.props}/>;
            case 7: return <Step5 nextStep={this.nextStep.bind(this)} {...this.props}/>;
            case 8: return <Step7 nextStep={this.nextStep.bind(this)} {...this.props}/>;
            case 9: return <Step8 nextStep={this.nextStep.bind(this)} {...this.props}/>;
            default: return <div></div>
        }
    }

    render() {
        return (
            <div className={'page flex-100 d-flex'}>
                {
                    this.renderSteps()
                }
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
    const creators = app_actions;

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
