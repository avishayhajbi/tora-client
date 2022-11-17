import React from 'react';
import {bindActionCreators} from 'redux';
import * as app_actions from './store/app/actions';
import Home from "./pages/Home";
import Login from './pages/Login';
import Management from './pages/Management';
import NotFound from './pages/NotFound';
import {connect} from 'react-redux';
import { HashRouter, BrowserRouter, Switch, Route, Redirect, Link} from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import './css/App.css';
import {isMobileView} from "./utils";
import store from './store';
import Modal from './components/Modal';
import {ButtonToolbar, ButtonGroup, Button, Navbar, Nav, NavDropdown, Container, Row, Col, Image} from 'react-bootstrap';
import $ from 'jquery';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as ICONS from "@fortawesome/free-solid-svg-icons";
import {Cart} from "./components/Cart";
import Badge from "react-bootstrap/Badge";
import rest from "./rest";

/*let { history } = this.props;
history.push({
    pathname: '/results',
    query: payload,
    questions: data.questions
});
this.props.location.questions*/

function select(state) {
    return state.app.token;
}

let currentValue;
function handleChange() {
    let previousValue = currentValue
    currentValue = select(store.getState())
    // console.log('token changed',previousValue, currentValue)
}

const unsubscribe = store.subscribe(handleChange)

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route render={(props) =>
        {
            return (
                rest.app.token
                ? <Component {...props} {...rest.computedMatch} />
                : <Redirect to={{pathname: '/',}} />
            )
        }

    } />
)

;(function() {
    var pushState = window.history.pushState;
    var replaceState = window.history.replaceState;

    window.history.pushState = function() {
        pushState.apply(window.history, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
    };

    window.history.replaceState = function() {
        replaceState.apply(window.history, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
    };

    window.addEventListener('popstate', function() {
        window.dispatchEvent(new Event('locationchange'))
    });
})();

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showModal:false,
            collapsed: true,
            location: '/',
        };
    }

    componentWillMount() {
        this.onDimensionsChanged();
    }

    componentDidMount() {
        window.addEventListener('locationchange', (e) => {
            this.setState({location: window.location.pathname})
        });
    }

    onDimensionsChanged(){
        this.props.actions.setMobileView(isMobileView())
        if (window.innerHeight < 600) {
            $('body').addClass('smallHeight');
        } else {
            $('body').removeClass('smallHeight');
        }
    }

    goToLogin(){
        setTimeout(this.closeNavbar.bind(this),250)
        window.location = '/login';
    }

    logout(){
        setTimeout(this.closeNavbar.bind(this),250)
        this.props.actions.logout();
    }

    handleSelect(eventKey){
        setTimeout(this.closeNavbar.bind(this),250)
        let { history } = this.refs.browserRef;
        history.push({
            pathname: eventKey,
        });
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    closeNavbar() {
        if (this.state.collapsed === false) {
            this.toggleNavbar();
        }
    }

    onClickTopBar() {
        if (this.props.app.token) {
            window.location = '/login';
        } else {
            window.history.go(-(window.history.length - 1));
            window.location = '/'
        }
    }

    async openCart() {

        this.props.actions.updateModal({
            show: true,
            title: 'הפסוקים שלי',
            body: <Cart verses={this.props.app.cart} actions={this.props.actions}/>,
        })
    }

    render () {
        return (
            <React.Fragment>
                <Navbar sticky="top" bg="light" expand="md" expanded={!this.state.collapsed}>
                    {this.state.location !== '/' && <Navbar.Brand className='pointer' onClick={()=>window.history.back()}>
                        <FontAwesomeIcon icon={ICONS.faArrowRight}/>
                    </Navbar.Brand>}
                    <Navbar.Brand className='pointer' onClick={this.onClickTopBar.bind(this)}>
                        <span>רכישת אותיות בספר תורה</span>
                    </Navbar.Brand>
                    <Navbar.Toggle ref={"navbartoggle"} aria-controls="basic-navbar-nav"
                                   children={
                                       <FontAwesomeIcon icon={ICONS.faBars}/>
                                   }
                                   onClick={this.toggleNavbar.bind(this)}/>
                    <Navbar.Collapse ref={"navbarcollapse"} id="basic-navbar-nav">
                        <Nav className="ml-auto" variant="pills" defaultActiveKey={window.location.pathname} onSelect={this.handleSelect.bind(this)}>
                        </Nav>
                        <Nav className="mr-auto">
                            {false && !this.props.app.token && <Button variant="outline-light" onClick={this.goToLogin.bind(this)}>התחבר</Button>}
                            {this.props.app.token && <Button variant="outline-light" onClick={this.logout.bind(this)}>התנתק</Button>}
                            <div className='pointer' onClick={this.openCart.bind(this)}>
                                <Badge text="white" style={{color: 'white'}}>({this.props.app.cart.length})</Badge>
                                <FontAwesomeIcon className='marginLeft5px' icon={ICONS.faShoppingCart} color={'white'}></FontAwesomeIcon>
                            </div>
                        </Nav>

                    </Navbar.Collapse>
                </Navbar>

                {<Modal show={this.props.app.modal && this.props.app.modal.show}
                        onHide={this.props.actions.resetModal}
                        onClose={this.props.actions.resetModal}
                        title={this.props.app.modal && this.props.app.modal.title}
                        body={this.props.app.modal && this.props.app.modal.body}
                        buttons={this.props.app.modal && this.props.app.modal.buttons}/>}

                <BrowserRouter ref={'browserRef'} className={`App flex-100 layout layout-align-center-center`}>
                  <Switch>
                      <Route exact path="/" key="default" component={Home} />
                      <Route path="/1" key="1" component={Home} />
                      <Route path="/2" key="2" component={Home} />
                      <Route path="/3" key="3" component={Home} />
                      <Route path="/4" key="4" component={Home} />
                      <Route path="/5" key="5" component={Home} />
                      <Route path="/6" key="6" component={Home} />
                      <Route path="/7" key="7" component={Home} />
                      <Route path="/8" key="8" component={Home} />
                      <Route exact path="/login" component={Login}/>
                      <PrivateRoute path="/management" component={Management} {...this.props}/>
                      <Route component={NotFound} />
                 </Switch>
                </BrowserRouter>
            </React.Fragment>
        )
    };
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
