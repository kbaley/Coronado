import React from 'react';
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

export default function InvestmentForm(props) {
  const [investment, setInvestment] = React.useState({
    name: '',
    symbol: '',
    shares: '',
    price: '',
    amount: '',
    date: new Date().toLocaleDateString(),
    currency: 'USD',
    dontRetrievePrices: false,
    accountId: '',
  });

  React.useEffect(() => {
    if (props.investment) {
      setInvestment({
        investmentId: props.investment.investmentId,
        name: props.investment.name,
        symbol: props.investment.symbol || '',
        shares: props.investment.shares || 0,
        price: props.investment.price || 0.00,
        amount: props.investment.shares && props.investment.price ? props.investment.shares * props.investment.price : 0,
        currency: props.investment.currency || 'USD',
        date: new Date().toLocaleDateString(),
        accountId: props.investment.transaction ? props.investment.transaction.accountId : '',
        dontRetrievePrices: props.investment.dontRetrievePrices,
      });
    }
  }, [props.investment]);

  const saveInvestment = () => {
    props.onSave(investment);
    setInvestment({
      name: '',
      symbol: '',
      shares: '',
      price: '',
      amount: '',
      currency: 'USD',
      dontRetrievePrices: false,
      date: new Date().toLocaleDateString(),
      accountId: '',
    });
    props.onClose();
  }

  const handleChangeField = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    if (e.target.type === "checkbox")
      value = e.target.checked;
    var newState = { ...investment, [name]: value };
    var amount = parseFloat(investment.amount) || 0;
    var shares = parseFloat(investment.shares) || 0;
    var price = parseFloat(investment.price) || 0;
    if (name === "shares") {
      amount = (price * (parseFloat(value) || 0)).toFixed(2);
      newState.amount = amount;
    } else if (name === "price") {
      amount = (shares * (parseFloat(value) || 0)).toFixed(2);
      newState.amount = amount;
    } else if (name === "amount") {
      if (shares !== 0) {
        price = (parseFloat(value) || 0) / shares;
        newState.price = price;
      }
    }
    setInvestment(newState);
  }

  return (
    <Dialog
      onClose={props.onClose}
      open={props.show}
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
              value={investment.name}
              onChange={handleChangeField} />
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="symbol"
              label="Symbol"
              fullWidth={true}
              value={investment.symbol}
              onChange={handleChangeField}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              select
              name="currency"
              label="Currency"
              fullWidth={true}
              value={investment.currency}
              onChange={handleChangeField}
            >
              <MenuItem value={'USD'}>USD</MenuItem>
              <MenuItem value={'CAD'}>CAD</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Tooltip title="Check this to exclude the investment when downloading the daily prices">
                  <Checkbox
                    name='dontRetrievePrices'
                    checked={investment.dontRetrievePrices}
                    onChange={handleChangeField}
                  />
                </Tooltip>
              }
              label="Exclude when downloading prices?"
            />
          </Grid>
          {!investment.investmentId &&
          <React.Fragment>
            <Grid item xs={4}>
              <TextField
                name="shares"
                label="Shares"
                fullWidth={true}
                value={investment.shares}
                onChange={handleChangeField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="price"
                label="Price"
                fullWidth={true}
                value={investment.price}
                onChange={handleChangeField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="amount"
                label="Amount"
                fullWidth={true}
                value={investment.amount}
                onChange={handleChangeField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="date"
                label="Date"
                fullWidth={true}
                value={investment.date}
                onChange={handleChangeField}
              />
            </Grid>
            <Grid item xs={8}>
              <FormControl>
                <InputLabel id="source-account">Account</InputLabel>
                <Select
                  labelId="source-account"
                  name="accountId"
                  style={{ "width": "250px" }}
                  value={investment.accountId}
                  onChange={handleChangeField}
                >
                  <MenuItem value={''}>None</MenuItem>
                  {props.accounts ? props.accounts.map(a =>
                    <MenuItem value={a.accountId} key={a.accountId}>{a.name}</MenuItem>
                  ) : <MenuItem>Select...</MenuItem>
                  }
                </Select>
              </FormControl>
            </Grid>
          </React.Fragment>
          }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={saveInvestment}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

