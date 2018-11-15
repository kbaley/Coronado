import React, { Component } from 'react';
import { Button,Modal,Form,FormControl,FormGroup,ControlLabel,Col } from 'react-bootstrap';

class CustomerForm extends Component {
  displayName = CustomerForm.name;
  constructor(props) {
    super(props);
    this.saveCustomer = this.saveCustomer.bind(this);   
    this.handleChangeField = this.handleChangeField.bind(this);
    this.state = {
      newCustomer: true,
      isLoading: true,
      customer: {name: ''}
    };
  }

  componentDidUpdate() {
    if (this.props.customer && this.props.customer.customerId && this.props.customer.customerId !== this.state.customer.customerId ) {
      this.setState({
        newCustomer: false,
        customer: {}
      });
    }
  }

  saveCustomer() {
    this.props.onSave(this.state.customer);
    this.setState({customer: {name: ''} });
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
