import React, { Component } from 'react';
import { Button, Modal, Form, FormControl, FormGroup, Col, Row } from 'react-bootstrap';
import InvoiceLineItems from "./InvoiceLineItems";
import { filter, findIndex } from "lodash";
import {v4 as uuidv4 } from 'uuid';

class InvoiceForm extends Component {
  displayName = InvoiceForm.name;
  blankLineItem = {
    description: '',
    quantity: '',
    unitAmount: '',
    status: 'Added',
    invoiceLineItemId: uuidv4()
  }
  initialState = {
      newInvoice: true,
      invoice: { date: new Date().toLocaleDateString(), invoiceNumber: '', lineItems: [Object.assign({}, this.blankLineItem)] }
    };
  constructor(props) {
    super(props);
    this.saveInvoice = this.saveInvoice.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleLineItemChanged = this.handleLineItemChanged.bind(this);
    this.handleLineItemAdded = this.handleLineItemAdded.bind(this);
    this.handleLineItemDeleted = this.handleLineItemDeleted.bind(this);
    this.state = Object.assign({}, this.initialState);
  }

  componentDidUpdate() {
    if (this.props.invoice && this.props.invoice.invoiceId && this.props.invoice.invoiceId !== this.state.invoice.invoiceId) {
      this.setState({
        newInvoice: false,
        invoice: {
          invoiceId: this.props.invoice.invoiceId,
          invoiceNumber: this.props.invoice.invoiceNumber,
          customerId: this.props.invoice.customerId,
          lineItems: this.props.invoice.lineItems,
          date: new Date(this.props.invoice.date).toLocaleDateString()
        }
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
    this.setState({ invoice: { ...this.state.invoice, [name]: e.target.value } });
  }

  handleLineItemChanged(lineItemId, field, value) {
    const index = findIndex(this.state.invoice.lineItems, li => li.invoiceLineItemId === lineItemId);
    
    const lineItems = this.state.invoice.lineItems;
    lineItems[index][field] = value;
    if (lineItems[index].status !== "Added")
      lineItems[index].status = "Updated";
    this.setState({...this.state, invoice: {...this.state.invoice, lineItems}});
  }

  handleLineItemAdded() {
    const lineItems = this.state.invoice.lineItems;
    
    this.blankLineItem.invoiceLineItemId = uuidv4();
    
    this.blankLineItem.invoiceId = this.state.invoice.invoiceId;
    this.setState(
      {...this.state, 
        invoice: {
          ...this.state.invoice, 
          lineItems: [...lineItems, Object.assign({}, this.blankLineItem)]
        }
      }
    );
    this.blankLineItem.invoiceLineItemId = '';
    this.blankLineItem.invoiceId = '';
  }

  handleLineItemDeleted(lineItemId) {
    const index = findIndex(this.state.invoice.lineItems, li => li.invoiceLineItemId === lineItemId);
    const lineItems = this.state.invoice.lineItems;
    lineItems[index].status = "Deleted";
    this.setState(
      {...this.state, 
        invoice: {
          ...this.state.invoice, 
          lineItems
        }
      }
    );
  }

  render() {
    return (
      <Modal size="lg" show={this.props.show} onHide={this.props.onClose} >
        <Modal.Header closeButton>
          <Modal.Title>Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup as={Row}>
              <Col as={Form.Label} sm={3}>Number</Col>
              <Col sm={2}>
                <FormControl autoFocus
                  type="text"
                  name="invoiceNumber"
                  value={this.state.invoice.invoiceNumber}
                  onChange={this.handleChangeField}
                />
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Col as={Form.Label} sm={3}>Date</Col>
              <Col sm={2}>
                <FormControl
                  type="text"
                  name="date" ref="inputName"
                  value={this.state.invoice.date}
                  onChange={this.handleChangeField}
                />
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Col as={Form.Label} sm={3}>Customer</Col>
              <Col sm={5}>
                <FormControl as="select" name="customerId" value={this.state.invoice.customerId}
                  onChange={this.handleChangeField}>
                  <option key="0" value="">Select...</option>
                  {this.props.customers ? this.props.customers.map(c =>
                    <option key={c.customerId} value={c.customerId}>{c.name}</option>
                  ) : <option></option>}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Col as={Form.Label} sm={3}>Line items</Col>
              <Col sm={9}>
                <InvoiceLineItems 
                  lineItems={filter(this.state.invoice.lineItems, li => li.status !== "Deleted")} 
                  onLineItemChanged={this.handleLineItemChanged} 
                  onNewItemAdded={this.handleLineItemAdded}
                  onLineItemDeleted={this.handleLineItemDeleted}
                  />
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
