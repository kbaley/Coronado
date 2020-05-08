import React from 'react';
import { Dialog, DialogContent, Grid, TextField, DialogActions, Button } from '@material-ui/core';

export default function CustomerForm(props) {
  const [customer, setCustomer] = React.useState({name: '', streetAddress: '', city: '', region: '', email: ''});
  const { show, onClose, onSave } = props;

  React.useEffect(() => {
    setCustomer({...props.customer});
  }, [props.customer])

  const saveCustomer = _ => {
    onSave(customer);
    setCustomer({name: '', streetAddress: '', city: '', region: '', email: ''});
    onClose();
  }

  const handleChangeField = e => {
    var name = e.target.name;
    setCustomer({...customer, [name]: e.target.value });
  }

    return (
      <Dialog
        fullWidth={true}
        maxWidth='sm'
        onClose={onClose}
        open={show}
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextField
                autoFocus
                name="name"
                fullWidth={true}
                label="Customer name"
                value={customer.name}
                onChange={handleChangeField} />
            </Grid>
            <Grid item xs={5}>
              <TextField
                name="email"
                fullWidth={true}
                label="Email address"
                value={customer.email}
                onChange={handleChangeField} />
            </Grid>
            <Grid item xs={12}>
            <TextField
              label="Street Address"
              name="streetAddress"
              fullWidth={true}
              value={customer.streetAddress}
              onChange={handleChangeField}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
              label="City"
              name="city"
              fullWidth={true}
              value={customer.city}
              onChange={handleChangeField}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField 
              label="Province/State"
              name="region"
              fullWidth={true}
              value={customer.region}
              onChange={handleChangeField}
            />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveCustomer}>Save</Button>
        </DialogActions>
      </Dialog>
    );
}
