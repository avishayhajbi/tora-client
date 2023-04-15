import React, {Component} from "react";
import '../css/Management.scss'
import rest from '../rest';
import {bindActionCreators} from 'redux';
import * as app_actions from '../store/app/actions';
import {connect} from "react-redux";
import * as ActionButton from "react-floating-action-button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as ICONS from "@fortawesome/free-solid-svg-icons";
import MyModal from "../components/Modal";
import Form from "../components/Form";
import {getBookForm, uploadImage} from "../config";
import {Book} from '../components/Book';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

class Management extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            showBookModal: false,
            showBookModalLoading: false,
        }
    }

    componentWillMount() {
        this.getBooks();
    }

    getBooks() {
        rest.getManagementBooks()
            .then((res) => {
                this.setState({books: res.data});
            })
            .catch(() => {
            })
            .finally(() => {
                this.setState({loading: false});
            })
    }

    addBookAction() {
        this.bookForm = getBookForm();
        this.bookFormCallback = this.addBook.bind(this);
        this.toggleBookModal();
    }
    goToContacts() {
        window.location.href = '/contact-us';
    }

    toggleBookModal() {
        this.setState({showBookModal: !this.state.showBookModal, showBookModalLoading: false});
    }

    toggleUploadImageModal() {
        this.setState({showUploadImageModal: !this.state.showUploadImageModal, uploadImageModalLoading: false});
    }

    addBook(data) {
        const toSend = new FormData();
        Object.keys(data).forEach(k => {
            if (k === 'image_url' && data[k].value) {
                toSend.append(k, data[k].value[0]);
            } else {
                toSend.append(k, data[k].value);
            }
        });
        this.setState({showBookModalLoading: true});
        rest.addBook(toSend)
            .then((data) => {
                this.toggleBookModal();
                this.getBooks();
            })
            .catch(() => {
                this.setState({showBookModalLoading: false});
            })
            .finally(() => {
            })
    }

    deleteBook(book) {
        rest.deleteBook(book._id)
            .then((data) => {
                this.getBooks();
            })
            .catch(() => {
            })
            .finally(() => {
            })
    }

    restoreBook(book) {
        rest.restoreBook(book._id)
            .then((data) => {
                this.getBooks();
            })
            .catch(() => {
            })
            .finally(() => {
            })
    }
    removeBookPermanently(book) {
        const text = "האם אתה בטוח?";
        if (window.confirm(text) == true) {
            rest.removeBookPermanently(book._id)
                .then((data) => {
                    this.getBooks();
                })
                .catch(() => {
                })
                .finally(() => {
                })
        }
    }

    updateBookAction(book) {
        this.bookForm = getBookForm();
        this.bookFormCallback = this.updateBook.bind(this, book._id);
        Object.keys(this.bookForm).forEach(k => {
            this.bookForm[k].value = book[k];
        })
        this.toggleBookModal();
    }

    uploadImageAction(book) {
        this.bookForm = uploadImage();
        this.bookFormCallback = this.uploadImage.bind(this, book._id);
        Object.keys(this.bookForm).forEach(k => {
            this.bookForm[k].value = book[k];
        })
        this.toggleUploadImageModal();
    }

    updateBook(bookId, data) {
        const toSend = new FormData();
        Object.keys(data).forEach(k => {
            if (k !== 'image_url'){
                toSend.append(k, data[k].value);
            }
        });
        this.setState({uploadImageModalLoading: true});
        rest.updateBook(bookId, toSend)
            .then((data) => {
                this.toggleBookModal();
                this.getBooks();
            })
            .catch(() => {
                this.setState({uploadImageModalLoading: false});
            })
            .finally(() => {
            })
    }

    uploadImage(bookId, data) {
        const toSend = new FormData();
        Object.keys(data).forEach(k => {
            if (k === 'image_url' && data[k].value && data[k].value[0]) {
                toSend.append(k, data[k].value[0]);
            }
        });
        this.setState({showBookModalLoading: true});
        rest.updateBook(bookId, toSend)
            .then((data) => {
                this.toggleUploadImageModal();
                this.getBooks();
            })
            .catch(() => {
                this.setState({showBookModalLoading: false});
            })
            .finally(() => {

            })
    }

    downloadXlsx(book) {
        rest.downloadXlsx(book._id)
            .then((data) => {
                console.log(data);
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${book._id}.xlsx`); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {

            })
    }

    render() {
        return (
            <div className={'page management flex-100'}>
                {this.state.books.map((book, index) => {
                    return (
                        <div key={index}
                             className='d-flex flex-column flex-100 justify-content-center align-content-center margin15'>
                            <Book {...book} isManagement={true} />
                            <ButtonGroup className='marginTop30px'>
                                {!book.deleted && <Button onClick={this.deleteBook.bind(this, book)}>מחק</Button>}
                                {book.deleted && <Button onClick={this.restoreBook.bind(this, book)}>שחזר</Button>}
                                {book.deleted && <Button onClick={this.removeBookPermanently.bind(this, book)}>הסר לצמיתות</Button>}
                                {!book.deleted && <Button onClick={this.updateBookAction.bind(this, book)}>ערוך</Button>}
                                <Button onClick={this.uploadImageAction.bind(this, book)}>העלאת תמונה</Button>
                            </ButtonGroup>
                            <ButtonGroup className='marginTop30px'>
                                <Button onClick={this.downloadXlsx.bind(this, book)}>הורד אקסל</Button>
                            </ButtonGroup>
                        </div>
                    )
                })}
                <MyModal show={this.state.showBookModal} onHide={this.toggleBookModal.bind(this)} hideFooter={true}
                         title={'ערוך ספר'}>
                    <Form fields={this.bookForm}
                          loading={this.state.showBookModalLoading}
                          submitText={"שמור"}
                          callback={this.bookFormCallback}/>
                </MyModal>

                <MyModal show={this.state.showUploadImageModal} onHide={this.toggleUploadImageModal.bind(this)}
                         hideFooter={true}
                         title={'העלאת תמונה'}>
                    <Form fields={this.bookForm}
                          preview={true}
                          loading={this.state.uploadImageModalLoading}
                          submitText={"שמור"}
                          callback={this.bookFormCallback}/>
                </MyModal>

                <ActionButton.Container className={`custom_fab-container`}>
                    <ActionButton.Link
                        tooltip="הוסף ספר"
                        children={
                            <div onClick={this.addBookAction.bind(this)}><FontAwesomeIcon icon={ICONS.faBook}/></div>
                        }
                    />
                    <ActionButton.Link
                        tooltip="צור קשר"
                        children={
                            <div onClick={this.goToContacts.bind(this)}><FontAwesomeIcon icon={ICONS.faPhone}/></div>
                        }
                    />
                    <ActionButton.Button
                        className="fab-item btn btn-link btn-lg text-white"
                        tooltip=""
                        icon="fa fa-plus"
                        rotate={true}
                    />
                </ActionButton.Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(Management);
