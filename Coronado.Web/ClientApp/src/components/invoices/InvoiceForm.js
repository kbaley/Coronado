import React from 'react';
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

export default function InvoiceForm(props) {
  let blankLineItem = {
    description: '',
    quantity: '',
    unitAmount: '',
    status: 'Added',
    invoiceLineItemId: uuidv4()
  }
  const [ invoice, setInvoice ] = React.useState({ 
    date: new Date().toLocaleDateString(), 
    invoiceNumber: '',
    customerId: '',
    lineItems: [Object.assign({}, blankLineItem)],
  });

  React.useEffect(() => {
    if (props.invoice) {
      setInvoice({ 
          invoiceId: props.invoice.invoiceId,
          invoiceNumber: props.invoice.invoiceNumber,
          customerId: props.invoice.customerId,
          lineItems: props.invoice.lineItems,
          date: new Date(props.invoice.date).toLocaleDateString()
      });
    }
  }, [props.invoice]);

  const saveInvoice = () => {
    props.onSave(invoice);
    setInvoice({ 
      date: new Date().toLocaleDateString(), 
      invoiceNumber: '',
      customerId: '',
      lineItems: [Object.assign({}, blankLineItem)],
    });
    props.onClose();
  }

  const handleChangeField = (e) => {
    var name = e.target.name;
    setInvoice({ 
      ...invoice, 
      [name]: e.target.value
    })
  }

  const handleLineItemChanged = (lineItemId, field, value) => {
    const index = findIndex(invoice.lineItems, li => li.invoiceLineItemId === lineItemId);
    
    const lineItems = invoice.lineItems;
    lineItems[index][field] = value;
    if (lineItems[index].status !== "Added")
      lineItems[index].status = "Updated";
    setInvoice({
      ...invoice,
      lineItems,
    })
  }

  const handleLineItemAdded = () => {
    const lineItems = invoice.lineItems;
    
    blankLineItem.invoiceLineItemId = uuidv4();
    
    blankLineItem.invoiceId = invoice.invoiceId;
    setInvoice({
      ...invoice,
      lineItems: [...lineItems, Object.assign({}, blankLineItem)],
    })
    blankLineItem.invoiceLineItemId = '';
    blankLineItem.invoiceId = '';
  }

  const handleLineItemDeleted = (lineItemId) => {
    const index = findIndex(invoice.lineItems, li => li.invoiceLineItemId === lineItemId);
    const lineItems = invoice.lineItems;
    lineItems[index].status = "Deleted";
    setInvoice({
      ...invoice,
      lineItems,
    });
  }

    return (
      <Dialog 
        maxWidth="md" 
        open={props.show} 
        onClose={props.onClose}
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
                value={invoice.invoiceNumber}
                onChange={handleChangeField}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth={true}
                name="date"
                label="Invoice Date"
                value={invoice.date}
                onChange={handleChangeField}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <InputLabel id="invoice-customer">Customer</InputLabel>
                <Select
                  labelId="invoice-customer"
                  name="customerId"
                  value={invoice.customerId}
                  style={{ minWidth: 150 }}
                  onChange={handleChangeField}
                >
                  <MenuItem value={''}>Select...</MenuItem>
                  {props.customers ? props.customers.map(c =>
                    <MenuItem value={c.customerId} key={c.customerId}>{c.name}</MenuItem>
                  ) : <MenuItem>Select...</MenuItem>
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>

                <InvoiceLineItems 
                  lineItems={filter(invoice.lineItems, li => li.status !== "Deleted")} 
                  onLineItemChanged={handleLineItemChanged} 
                  onNewItemAdded={handleLineItemAdded}
                  onLineItemDeleted={handleLineItemDeleted}
                  />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveInvoice}>Save</Button>
        </DialogActions>
      </Dialog>
    );
}
