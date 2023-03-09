import React, { Component } from "react";
import "../css/Form.css";
import { FormErrors } from "./FormErrors";
import { Form, Button, Spinner } from "react-bootstrap";
import cloneDeep from "lodash/cloneDeep";
import * as app_actions from "../store/app/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import $ from "jquery";
import ToggleButton from "react-bootstrap/ToggleButton";

const actions = [app_actions];

class MyForm extends Component {
  constructor(props) {
    super(props);
    this.FIELDS = this.props.fields;
    this.FIELDS_MIRROR = {};
    Object.keys(this.FIELDS).forEach((v) => {
      this.FIELDS_MIRROR[v] = v;
    });
    this.state = {
      fields: cloneDeep(this.FIELDS),
      formErrors: {},
      validation: {},
    };
  }

  componentDidMount() {
    if (this.props.triggerSubmitOnCreate) {
      setTimeout(() => {
        this.validateForm();
        this.updateOnChanges();
      }, 1000 * 3);
    }
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let validation = this.state.validation;
    let KEYS = this.FIELDS_MIRROR;
    switch (fieldName) {
      case KEYS.email:
        let valid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors[fieldName] = valid ? "" : "אימייל לא תקין";
        validation[fieldName] = !!valid;
        break;
      default: {
        let valid = value;
        validation[fieldName] = !!valid;
        break;
      }
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        validation: validation,
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formInvalid: !(
        this.props.reff?.current || this.refs.formRef
      )?.checkValidity(),
    });
  }

  getFormFields() {
    let fields = [];
    Object.keys(this.FIELDS).forEach((key) => {
      let field = "";
      const selected = this.FIELDS[key].value || null;
      switch (this.FIELDS[key].type) {
        case "select": {
          field = (
            <Form.Group
              ref={`parent_${key}`}
              key={key}
              controlId={key}
              className={"form-group"}
            >
              <Form.Label>
                {this.FIELDS[key].title}{" "}
                {this.FIELDS[key]?.settings?.required && "*"}
              </Form.Label>
              <Form.Control
                ref={`${key}`}
                as="select"
                onChange={(event) => this.handleUserSelect(event)}
                {...(this.FIELDS[key].settings || {})}
                name={key}
              >
                {this.FIELDS[key].options.map((item) => {
                  return (
                    <option selected={selected == item.key} key={item.key}>
                      {item.value}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
          );
          break;
        }
        case "date": {
          field = (
            <Form.Group ref={`parent_${key}`} key={key} controlId={key}>
              <Form.Label>
                {this.FIELDS[key].title}{" "}
                {this.FIELDS[key]?.settings?.required && "*"}
              </Form.Label>
              <Form.Control
                ref={`${key}`}
                type={this.FIELDS[key].type}
                placeholder={this.FIELDS[key].placeholder || ""}
                {...(this.FIELDS[key].settings || {})}
                name={key}
                onClick={(event) => this.toggleDate(event)}
                onChange={(event) => this.handleDateInput(event)}
              />
            </Form.Group>
          );
          break;
        }
        case "textarea": {
          field = (
            <Form.Group ref={`parent_${key}`} key={key} controlId={key}>
              <Form.Label>
                {this.FIELDS[key].title}{" "}
                {this.FIELDS[key]?.settings?.required && "*"}
              </Form.Label>
              <Form.Control
                ref={`${key}`}
                as={this.FIELDS[key].type}
                placeholder={this.FIELDS[key].placeholder || ""}
                {...(this.FIELDS[key].settings || {})}
                defaultValue={selected}
                name={key}
                onChange={(event) => this.handleUserInput(event)}
              />
            </Form.Group>
          );
          break;
        }
        case "checkbox": {
          field = (
            <Form.Group ref={`parent_${key}`} key={key} controlId={key}>
              <Form.Check
                ref={`${key}`}
                label={
                  this.FIELDS[key].title +
                  ((this.FIELDS[key]?.settings?.required && "*") || "")
                }
                type={this.FIELDS[key].type}
                placeholder={this.FIELDS[key].placeholder || ""}
                {...(this.FIELDS[key].settings || {})}
                defaultValue={selected}
                name={key}
                onChange={(event) => this.handleCheckboxInput(event)}
              />
            </Form.Group>
          );
          break;
        }
        case "radio": {
          if (!this.state.fields[key].value) {
            this.state.fields[key].value = this.FIELDS[key]?.selected;
          }
          field = (
            <Form.Group ref={`parent_${key}`} key={key} controlId={key}>
              <Form.Label>
                {this.FIELDS[key].title}{" "}
                {this.FIELDS[key]?.settings?.required && "*"}
              </Form.Label>
              {this.FIELDS[key].options.map((radio, idx) => {
                return (
                  <Form.Check
                    onChange={(event) => this.handleRadioInput(event)}
                    inline
                    key={idx}
                    id={`radio-${key}-${idx}`}
                    type="radio"
                    variant={"outline-info"}
                    name={key}
                    value={radio.key}
                    checked={this.state.fields[key].value === radio.key}
                    label={radio.value}
                  />
                );
              })}
            </Form.Group>
          );
          break;
        }
        case "file": {
          field = (
            <Form.Group ref={`parent_${key}`} key={key} controlId={key}>
              <Form.Label>{this.FIELDS[key].title}</Form.Label>
              {this.props.preview && this.FIELDS[key].value && (
                <div>
                  <img
                    className="marginBottom30px"
                    width={150}
                    height="auto"
                    id={key}
                    src={this.FIELDS[key].value}
                  />
                </div>
              )}
              <Form.File
                type="file"
                id={key}
                label={this.FIELDS[key].title}
                onChange={this.handleFileInput.bind(this)}
                custom
              />
            </Form.Group>
          );
          break;
        }
        default: {
          // className={this.state.validation[key]===false && 'invalidInputBorder'}
          field = (
            <Form.Group ref={`parent_${key}`} key={key} controlId={key}>
              <Form.Label>
                {this.FIELDS[key].title}&nbsp;
                {this.FIELDS[key].subTitle && (
                  <Form.Text>{this.FIELDS[key].subTitle}</Form.Text>
                )}
                {this.FIELDS[key]?.settings?.required && "*"}
              </Form.Label>
              <Form.Control
                ref={`${key}`}
                type={this.FIELDS[key].type}
                placeholder={this.FIELDS[key].placeholder || ""}
                {...(this.FIELDS[key].settings || {})}
                defaultValue={selected}
                name={key}
                onBlur={(event) => this.handleUserInput(event)}
                onChange={(event) => this.handleUserInput(event)}
              />
              <p className={"invalidInput"}>{this.state.formErrors[key]}</p>
            </Form.Group>
          );
        }
      }
      fields.push(field);
    });

    return fields;
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    let fields = this.state.fields;
    fields[name].value = value;
    this.setState({ fields }, () => {
      this.validateField(name, value);
    });
    this.updateOnChanges();
  }

  handleCheckboxInput(e) {
    const name = e.target.name;
    const value = e.target.checked;
    let fields = this.state.fields;
    fields[name].value = value;
    this.setState({ fields }, () => {
      this.validateField(name, value);
    });
    this.updateOnChanges();
  }

  handleRadioInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    let fields = this.state.fields;
    fields[name].value = value;
    this.setState({ fields }, () => {
      this.validateField(name, value);
    });
    this.updateOnChanges();
  }

  readURL(key, input) {
    try {
      if (input && input[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          document.getElementById(key).src = e.target.result;
        };
        reader.readAsDataURL(input[0]);
      }
    } catch (e) {}
  }

  handleFileInput(e) {
    const name = e.target.id;
    const value = e.target.files;
    let fields = this.state.fields;
    fields[name].value = value;
    this.setState({ fields }, () => {
      this.validateField(name, value);
    });
    this.readURL(e.target.id, value);
    this.updateOnChanges();
  }

  handleUserSelect(e) {
    const name = e.target.name;
    const value = this.FIELDS[name].options[e.target.selectedIndex].key; //e.target.value;
    let fields = this.state.fields;
    fields[name].value = value;
    this.setState({ fields }, () => {
      this.validateField(name, value);
    });
    this.updateOnChanges();
  }

  childHandleUserInput(e, parent, index) {
    const name = e.target.name;
    const value = e.target.value;
    let fields = this.state.fields;
    fields[parent].children[index].value = value;
    this.setState({ fields }, () => {});
    this.updateOnChanges();
  }

  updateOnChanges() {
    if (this.props.everyChangeUpdate) {
      this.props.callback(
        cloneDeep({
          ...this.state.fields,
          event: "update",
          valid: !this.state.formInvalid,
        }),
        this.refs
      );
    }
  }

  toggleDate(e) {
    const input = $(`input[name=${e.target.name}]`);
    input.trigger("click");
  }

  handleDateInput(e) {
    const input = $(`input[name=${e.target.name}]`);
    input.attr(
      "data-date",
      moment(e.target.value, "YYYY-MM-DD").format(
        input.attr("data-date-format")
      )
    );
    const name = e.target.name;
    const value = e.target.value;
    if (!value) return;
    let fields = this.state.fields;
    fields[name].value = value;
    this.setState({ fields }, () => {
      this.validateField(name, value);
    });
    // console.table(fields);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("form is valid: ", !this.state.formInvalid);
    // console.table(this.state.formErrors);
    // console.table(this.state.validation);
    // console.table(this.state.fields);
    if (!this.state.formInvalid && this.props.callback) {
      this.props.callback(cloneDeep(this.state.fields), this.refs);
    }
  }

  render() {
    return (
      <div className={`form layout layout-align-center-center`}>
        <Form
          ref={this.props.reff || "formRef"}
          className={`flex-100`}
          {...this.props.formOptions}
          onSubmit={this.handleSubmit.bind(this)}
        >
          {this.getFormFields()}
          <div className="display-flex width100 layout-align-center-center justify-content-center">
            {this.props.loading && (
              <Spinner
                className={"marginTop10px marginBottom10px"}
                animation="border"
              />
            )}
            {!this.props.loading && this.props.submitText && (
              <Button
                className={"marginTop10px marginBottom10px"}
                disabled={false}
                variant="secondary"
                type="submit"
              >
                {this.props.submitText}
                {/* <img src="/assets/search.svg" width="30" /> */}
              </Button>
            )}
          </div>
        </Form>

        <div className="layout layout-align-center-center">
          {false && <FormErrors formErrors={this.state.formErrors} />}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  const creators = app_actions;

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyForm);
