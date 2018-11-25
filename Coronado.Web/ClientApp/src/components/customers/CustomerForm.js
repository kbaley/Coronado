import React, { Component } from 'react';
import { Button,Modal,Form,FormControl,FormGroup,ControlLabel,Col } from 'react-bootstrap';
import TextField from "../common/TextField";

class CustomerForm extends Component {
  displayName = CustomerForm.name;
  constructor(props) {
    super(props);
    this.saveCustomer = this.saveCustomer.bind(this);   
    this.handleChangeField = this.handleChangeField.bind(this);
    this.state = {
      newCustomer: true,
      customer: {name: '', streetAddress: '', city: '', region: '', email: ''}
    };
  }

  componentDidUpdate() {
    if (this.props.customer && this.props.customer.customerId && this.props.customer.customerId !== this.state.customer.customerId ) {
      this.setState({
        newCustomer: false,
        customer: {
          customerId: this.props.customer.customerId, 
          name: this.props.customer.name,
          streetAddress: this.props.customer.streetAddress || '',
          city: this.props.customer.city || '',
          region: this.props.customer.region || '',
          email: this.props.customer.email || ''
        }
      });
    }
  }

  saveCustomer() {
    this.props.onSave(this.state.customer);
    this.setState({customer: {name: '', streetAddress: '', city: '', region: '', email: ''} });
    this.props.onClose();
  }

  handleChangeField(e) {
    var name = e.target.name;
    this.setState( { customer: {...this.state.customer, [name]: e.target.value } } );
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Name</Col>
              <Col sm={9}>
            <FormControl
              type="text" autoFocus
              name="name" ref="inputName"
              value={this.state.customer.name}
              onChange={this.handleChangeField}
            />
              </Col>
            </FormGroup>
            <TextField width={4}
              label="Email"
              name="email"
              value={this.state.customer.email}
              onChange={this.handleChangeField}
            />
            <TextField
              label="Street Address"
              name="streetAddress"
              value={this.state.customer.streetAddress}
              onChange={this.handleChangeField}
            />
            <TextField width={4}
              label="City"
              name="city"
              value={this.state.customer.city}
              onChange={this.handleChangeField}
            />
            <TextField width={4}
              label="Region"
              name="region"
              value={this.state.customer.region}
              onChange={this.handleChangeField}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.saveCustomer}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

export default CustomerForm;
