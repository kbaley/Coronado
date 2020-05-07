import React, { Component } from 'react';
import { Dialog, DialogContent, Grid, TextField, DialogActions, Button } from '@material-ui/core';

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
      <Dialog
        fullWidth={true}
        maxWidth='sm'
        onClose={this.props.onClose}
        open={this.props.show}
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextField
                autoFocus
                name="name"
                fullWidth={true}
                label="Customer name"
                value={this.state.customer.name}
                onChange={this.handleChangeField} />
            </Grid>
            <Grid item xs={5}>
              <TextField
                name="email"
                fullWidth={true}
                label="Email address"
                value={this.state.customer.email}
                onChange={this.handleChangeField} />
            </Grid>
            <Grid item xs={12}>
            <TextField
              label="Street Address"
              name="streetAddress"
              fullWidth={true}
              value={this.state.customer.streetAddress}
              onChange={this.handleChangeField}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
              label="City"
              name="city"
              fullWidth={true}
              value={this.state.customer.city}
              onChange={this.handleChangeField}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField 
              label="Province/State"
              name="region"
              fullWidth={true}
              value={this.state.customer.region}
              onChange={this.handleChangeField}
            />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.saveCustomer}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  };
}

export default CustomerForm;
