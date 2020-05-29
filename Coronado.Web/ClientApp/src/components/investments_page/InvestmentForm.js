import React, { Component } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core';

class InvestmentForm extends Component {
  displayName = InvestmentForm.name;
  constructor(props) {
    super(props);
    this.saveInvestment = this.saveInvestment.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.state = {
      newInvestment: true,
      investment: { 
        name: '', 
        symbol: '', 
        shares: '', 
        price: '', 
        date: new Date().toLocaleDateString(),
        currency: 'USD', 
        dontRetrievePrices: false,
        accountId: '',
      }
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
          date: new Date().toLocaleDateString(),
          accountId: this.props.investment.transaction ? this.props.investment.transaction.accountId : '',
          dontRetrievePrices: this.props.investment.dontRetrievePrices
        }
      });
    }
  }

  saveInvestment() {
    this.props.onSave(this.state.investment);
    this.setState({ 
      investment: { 
        name: '', 
        symbol: '', 
        shares: '', 
        price: '', 
        currency: 'USD', 
        dontRetrievePrices: false ,
        date: new Date().toLocaleDateString(),
        accountId: '',
      } 
    });
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
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextField
                autoFocus
                name="name"
                label="Investment name"
                fullWidth={true}
                value={this.state.investment.name}
                onChange={this.handleChangeField} />
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="symbol"
                label="Symbol"
                fullWidth={true}
                value={this.state.investment.symbol}
                onChange={this.handleChangeField}
              />
            </Grid>
            <Grid item xs={2}>
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
            <Grid item xs={4}>
              <TextField
                name="shares"
                label="Shares"
                fullWidth={true}
                value={this.state.investment.shares}
                onChange={this.handleChangeField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="price"
                label="Price"
                fullWidth={true}
                value={this.state.investment.price}
                onChange={this.handleChangeField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="date"
                label="Date"
                fullWidth={true}
                value={this.state.investment.date}
                onChange={this.handleChangeField}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <InputLabel id="source-account">Account</InputLabel>
                <Select
                  labelId="source-account"
                  name="accountId"
                  style={{"width": "250px"}}
                  value={this.state.investment.accountId}
                  onChange={this.handleChangeField}
                >
                  <MenuItem value={''}>None</MenuItem>
                  {this.props.accounts ? this.props.accounts.map(a =>
                    <MenuItem value={a.accountId} key={a.accountId}>{a.name}</MenuItem>
                  ) : <MenuItem>Select...</MenuItem>
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Tooltip title="Check this to include the investment when downloading the daily prices">
                    <Checkbox
                      name='dontRetrievePrices'
                      checked={!this.state.dontRetrievePrices}
                      onChange={this.handleChangeField}
                    />
                  </Tooltip>
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
