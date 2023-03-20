import React, { Component,useState } from "react";
import { Modal, Button,} from 'react-bootstrap';

class MyModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            show: props.show
        }
    }
    componentDidMount() {
        this.componentWillHandleProps(this.props, true);
    }
    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.componentWillHandleProps(nextProps, false);
    }

    componentWillHandleProps(nextProps, isFirstTime) {
        if (nextProps.show) this.handleShow();
        else this.handleClose();
    }

    /*listener(data) {
        this.handleClose();
    }*/

    handleClose() {
        this.setState({show:false});
        /*window.removeEventListener("hashchange", this.listener);
        if (window.location.hash === "#modal") {
            window.history.back();
        }*/
    }

    handleShow() {
        this.setState({show:true});
        /*window.location.hash = "#modal";
        window.addEventListener("hashchange", this.listener, false);*/
    }

    onClose(status) {
        if (this.props.onClose && typeof this.props.onClose === 'function') this.props.onClose(status);
    }

    render () {
        return (
            <Modal size="lg"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
                   show={Boolean(this.state.show)}
                   onHide={this.props.onHide || this.handleClose.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title className={'flex-100 layout layout-row layout-align-center-center'}>
                        <h3 className={"primary text-center"}>{this.props.title}</h3>
                    </Modal.Title>
                </Modal.Header>
                {(this.props.children) && <Modal.Body className={'text-right'}>{this.props.children}</Modal.Body>}
                {!(this.props.children) && <Modal.Body className={'text-right'}>{this.props.body}</Modal.Body>}
                {!this.props.hideFooter && <Modal.Footer className={'modalFooter flex-100 layout layout-row layout-align-space-between-center'}>
                    {this.props.buttons && this.props.buttons.map((btn,i)=><Button key={`_${i}`} variant={btn.class || 'primary'} onClick={btn.callback || this.props.onHide || this.handleClose.bind(this)}>{btn.name || 'OK'}</Button>)}
                </Modal.Footer>}
            </Modal>
        )
    }
}
export default MyModal;
