import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, FormControlLabel, Checkbox, MenuItem } from '@material-ui/core';

class InvestmentForm extends Component {
  displayName = InvestmentForm.name;
  constructor(props) {
    super(props);
    this.saveInvestment = this.saveInvestment.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.state = {
      newInvestment: true,
      investment: { name: '', symbol: '', shares: '', price: '', currency: 'USD', dontRetrievePrices: false }
    };
  }

  componentDidUpdate() {
    if (this.props.investment && this.props.investment.investmentId
      && this.props.investment.investmentId !== this.state.investment.investmentId) {
      this.setState({
        newInvestment: false,
        investment: {
          investmentId: this.props.investment.investmentId,
          name: this.props.investment.name,
          symbol: this.props.investment.symbol || '',
          shares: this.props.investment.shares || 0,
          price: this.props.investment.price || 0.00,
          currency: this.props.investment.currency || 'USD',
          dontRetrievePrices: this.props.investment.dontRetrievePrices
        }
      });
    }
  }

  saveInvestment() {
    this.props.onSave(this.state.investment);
    this.setState({ investment: { name: '', symbol: '', shares: '', price: '', currency: 'USD', dontRetrievePrices: false } });
    this.props.onClose();
  }

  handleChangeField(e) {
    var name = e.target.name;
    var value = e.target.value;
    if (e.target.type === "checkbox")
      value = e.target.checked;
    this.setState({ investment: { ...this.state.investment, [name]: value } });
  }

  render() {
    return (
      <Dialog
        onClose={this.props.onClose}
        open={this.props.show}
        fullWidth={true}
        maxWidth={'sm'}
      >
        <DialogTitle>Investment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                autoFocus
                name="name"
                label="Investment name"
                fullWidth={true}
                value={this.state.investment.name}
                onChange={this.handleChangeField} />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="symbol"
                label="Symbol"
                fullWidth={true}
                value={this.state.investment.symbol}
                onChange={this.handleChangeField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="shares"
                label="Starting shares"
                fullWidth={true}
                value={this.state.investment.shares}
                onChange={this.handleChangeField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="price"
                label="Starting price"
                fullWidth={true}
                value={this.state.investment.price}
                onChange={this.handleChangeField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                name="currency"
                label="Currency"
                fullWidth={true}
                value={this.state.investment.currency}
                onChange={this.handleChangeField}
              >
                <MenuItem value={'USD'}>USD</MenuItem>
                <MenuItem value={'CAD'}>CAD</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name='dontRetrievePrices'
                    checked={!this.state.dontRetrievePrices}
                    onChange={this.handleChangeField}
                  />
                }
                label="Retrieve prices?"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.saveInvestment}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  };
}

export default InvestmentForm;
