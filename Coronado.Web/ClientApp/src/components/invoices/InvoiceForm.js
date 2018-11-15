import React, { Component } from 'react';
import { Button, Modal, Form, FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import InvoiceLineItems from "./InvoiceLineItems";

class InvoiceForm extends Component {
  displayName = InvoiceForm.name;
  initialState = {
      newInvoice: true,
      invoice: { date: new Date().toLocaleDateString(), invoiceNumber: '', lineItems: [{description: '', quantity: '', unitAmount: ''}] }
    };
  constructor(props) {
    super(props);
    this.saveInvoice = this.saveInvoice.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleLineItemChanged = this.handleLineItemChanged.bind(this);
    this.state = Object.assign({}, this.initialState);
  }

  componentDidUpdate() {
    if (this.props.invoice && this.props.invoice.invoiceId && this.props.invoice.invoiceId !== this.state.invoice.invoiceId) {
      this.setState({
        newInvoice: false,
        invoice: {}
      });
    }
  }

  saveInvoice() {
    this.props.onSave(this.state.invoice);
    this.setState(Object.assign({}, this.initialState));
    this.props.onClose();
  }

  handleChangeField(e) {
    var name = e.target.name;
    console.log(this.state);
    
    this.setState({ invoice: { ...this.state.invoice, [name]: e.target.value } });
  }

  handleLineItemChanged(index, field, value) {
    const lineItems = this.state.invoice.lineItems;
    lineItems[index][field] = value;
    this.setState({...this.state, invoice: {...this.state.invoice, lineItems}});
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Number</Col>
              <Col sm={5}>
                <FormControl autoFocus
                  type="text"
                  name="invoiceNumber"
                  value={this.state.invoice.invoiceNumber}
                  onChange={this.handleChangeField}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Date</Col>
              <Col sm={5}>
                <FormControl
                  type="text"
                  name="name" ref="inputName"
                  value={this.state.invoice.date}
                  onChange={this.handleChangeField}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Customer</Col>
              <Col sm={5}>
                <FormControl componentClass="select" name="customerId" value={this.state.invoice.customerId}
                  onChange={this.handleChangeField}>
                  <option key="0" value="">Select...</option>
                  {this.props.customers ? this.props.customers.map(c =>
                    <option key={c.customerId} value={c.customerId}>{c.name}</option>
                  ) : <option></option>}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Line items</Col>
              <Col sm={9}>
                <InvoiceLineItems lineItems={this.state.invoice.lineItems} onLineItemChanged={this.handleLineItemChanged} />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.saveInvoice}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

export default InvoiceForm;
