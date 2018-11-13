import React, { Component } from 'react';
import { Button,Modal,Form,FormControl,FormGroup,ControlLabel,Col } from 'react-bootstrap';

class InvoiceForm extends Component {
  displayName = InvoiceForm.name;
  constructor(props) {
    super(props);
    this.saveInvoice = this.saveInvoice.bind(this);   
    this.handleChangeField = this.handleChangeField.bind(this);
    this.state = {
      newInvoice: true,
      isLoading: true,
      invoice: {}
    };
  }

  componentDidUpdate() {
    if (this.props.invoice && this.props.invoice.invoiceId && this.props.invoice.invoiceId !== this.state.invoice.invoiceId ) {
      this.setState({
        newInvoice: false,
        invoice: {}
      });
    }
  }

  saveInvoice() {
    this.props.onSave(this.state.invoice);
    this.setState({invoice: {name: '', type: ''} });
    this.props.onClose();
  }

  handleChangeField(e) {
    var name = e.target.name;
    this.setState( { invoice: {...this.state.invoice, [name]: e.target.value } } );
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Date</Col>
              <Col sm={9}>
            <FormControl
              type="text" autoFocus
              name="name" ref="inputName"
              value={this.state.invoice.date}
              onChange={this.handleChangeField}
            />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Customer</Col>
              <Col sm={5}>
                <FormControl type="text" value={this.state.invoice.customer}
                  name="type"
                  onChange={this.handleChangeField}
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
