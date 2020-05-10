import React, { Component } from 'react';
import InvoiceLineItems from "./InvoiceLineItems";
import { filter, findIndex } from "lodash";
import {v4 as uuidv4 } from 'uuid';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  Grid, 
  TextField, 
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@material-ui/core';

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
      invoice: { 
        date: new Date().toLocaleDateString(), 
        invoiceNumber: '', 
        customerId: '',
        lineItems: [Object.assign({}, this.blankLineItem)] 
      }
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
      <Dialog 
        maxWidth="md" 
        open={this.props.show} 
        onClose={this.props.onClose}
        fullWidth={true}
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                autoFocus
                fullWidth={true}
                name="invoiceNumber"
                label="Invoice Number"
                value={this.state.invoice.invoiceNumber}
                onChange={this.handleChangeField}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth={true}
                name="date"
                label="Invoice Date"
                value={this.state.invoice.date}
                onChange={this.handleChangeField}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <InputLabel id="invoice-customer">Customer</InputLabel>
                <Select
                  labelId="invoice-customer"
                  name="customerId"
                  value={this.state.invoice.customerId}
                  style={{ minWidth: 150 }}
                  onChange={this.handleChangeField}
                >
                  <MenuItem value={''}>Select...</MenuItem>
                  {this.props.customers ? this.props.customers.map(c =>
                    <MenuItem value={c.customerId} key={c.customerId}>{c.name}</MenuItem>
                  ) : <MenuItem>Select...</MenuItem>
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>

                <InvoiceLineItems 
                  lineItems={filter(this.state.invoice.lineItems, li => li.status !== "Deleted")} 
                  onLineItemChanged={this.handleLineItemChanged} 
                  onNewItemAdded={this.handleLineItemAdded}
                  onLineItemDeleted={this.handleLineItemDeleted}
                  />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.saveInvoice}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  };
}

export default InvoiceForm;
