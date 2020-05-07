import React, { Component } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  Grid, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Checkbox, 
  FormControlLabel 
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export class AccountForm extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeMortgageType = this.handleChangeMortgageType.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {
      newAccount: true,
      account: { 
        name: '', 
        vendor: '', 
        startingBalance: 0, 
        currency: 'USD', 
        mortgageType: 'fixedPayment',
        mortgagePayment: '',
        accountType: 'Cash',
        startDate: new Date().toLocaleDateString() }
    };
  }

  componentDidUpdate() {
    if (this.props.account && this.props.account.accountId !== this.state.account.accountId) {
      this.setState({
        newAccount: false,
        account: { 
          accountId: this.props.account.accountId,
          name: this.props.account.name,
          vendor: this.props.account.vendor || '',
          currency: this.props.account.currency || '',
          accountType: this.props.account.accountType || '',
          mortgageType: this.props.account.mortgageType || '',
          mortgagePayment: this.props.account.mortgagePayment || '',
          isHidden: this.props.account.isHidden
        }
      });
    }
  }
  

  handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    if (e.target.type === "checkbox")
      value = e.target.checked;
    this.setState({ account: { ...this.state.account, [name]: value } });
  }

  handleChangeType(e) {
    this.setState({ account: { ...this.state.account, accountType: e.target.value } });
  }

  handleChangeMortgageType(e, newMortgageType) {
    console.log(e);
    this.setState({ account: { ...this.state.account, mortgageType: newMortgageType } } );
  }

  onSave() {
    this.props.onSave(this.state.account);
    if (this.state.newAccount)
    {
      this.setState({ account: { ...this.state.account, name: '', startingBalance: 0, currency: 'USD', vendor: '' } });
    }
    this.props.onClose();
  }
  render() {
    return (
    <Dialog 
      maxWidth="sm" 
      fullWidth={true}
      open={this.props.show} 
      onClose={this.props.onClose}
    >
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              autoFocus
              name="name"
              label="Account Name"
              fullWidth={true}
              value={this.state.account.name}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="vendor"
              label="Vendor"
              fullWidth={true}
              value={this.state.account.vendor}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl>
            <InputLabel id="account-type">Account Type</InputLabel>
            <Select
              labelId="account-type"
              value={this.state.account.accountType}
              style={{minWidth: 100}}
              onChange={this.handleChangeType}
            >
              {this.props.accountTypes ? this.props.accountTypes.map((t,i) => 
              <MenuItem key={i} value={t}>{t}</MenuItem>
              ) : <MenuItem>Select...</MenuItem>}
            </Select>
            </FormControl>
          </Grid>
          {this.state.newAccount &&
          <Grid item xs={4}>
              <TextField
                fullWidth={true}
                name="startingBalance"
                label="Starting Balance"
                value={this.state.account.startingBalance}
                onChange={this.handleChange}
              />
          </Grid>
          }
          {this.state.newAccount &&
          <Grid item xs={4}>
              <TextField
                fullWidth={true}
                name="startDate"
                label="Starting Date"
                value={this.state.account.startDate}
                onChange={this.handleChange}
              />
          </Grid>
          }
          <Grid item xs={4}>
            <TextField
              name="currency"
              label="Currency"
              value={this.state.account.currency}
              onChange={this.handleChange}
            />
          </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name='isHidden'
                    checked={this.state.account.isHidden}
                    onChange={this.handleChange}
                  />
                }
                label="Account is hidden"
              />
            </Grid>
            {this.state.account.accountType === "Mortgage" &&
            <React.Fragment>
            <Grid item xs={4}>
              <TextField
                name="mortgagePayment"
                label="Mortgage Payment"
                fullWidth={true}
                value={this.state.account.mortgagePayment}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={8}>
                <ToggleButtonGroup 
                  exclusive
                  value={this.state.account.mortgageType} 
                  onChange={this.handleChangeMortgageType} 
                  name="mortgageType"
                >
                  <ToggleButton value={'fixedPayment'}>Fixed Payment</ToggleButton>
                  <ToggleButton value={'fixedPrincipal'}>Fixed Principal</ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            </React.Fragment>
            }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.onSave}>Save</Button>
      </DialogActions>
    </Dialog>
    );
  }
}