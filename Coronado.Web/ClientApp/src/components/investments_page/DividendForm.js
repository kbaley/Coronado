import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core';
import { getEmptyGuid } from '../common/guidHelpers';

export default function DividendForm(props) {
  const [investment, setInvestment] = React.useState({
    name: '',
    symbol: '',
    amount: '',
    date: new Date().toLocaleDateString(),
    accountId: '',
    description: '',
    incomeTax: '',
  });
  const emptyGuid = getEmptyGuid();

  React.useEffect(() => {
    if (props.investment && props.investment.name !== '') {
      setInvestment({
        investmentId: props.investment.investmentId,
        name: props.investment.name,
        symbol: props.investment.symbol,
        amount: props.investment.amount || 0.00,
        date: new Date().toLocaleDateString(),
        accountId: props.investment.accountId,
        description: props.investment.description || '',
        incomeTax: props.investment.incomeTax || 0.00,
      });
    }
  }, [props.investment]);

  const saveInvestment = () => {
    props.onSave(investment);
    setInvestment({
      name: '',
      amount: '',
      symbol: '',
      date: new Date().toLocaleDateString(),
      accountId: '',
      description: '',
      incomeTax: '',
    });
    props.onClose();
  }

  const handleChangeField = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    if (e.target.type === "checkbox")
      value = e.target.checked;
    var newState = { ...investment, [name]: value };
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
          <Grid item xs={12}>
            <div>
              {investment.name} ({investment.symbol})
            </div>
          </Grid>
          <Grid item xs={2}>
            <TextField
              name="date"
              label="Date"
              fullWidth={true}
              value={investment.date}
              onChange={handleChangeField}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="amount"
              label="Amount"
              fullWidth={true}
              value={investment.amount}
              onChange={handleChangeField}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="incomeTax"
              label="Income Tax"
              fullWidth={true}
              value={investment.incomeTax}
              onChange={handleChangeField}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel id="source-account">Account</InputLabel>
              <Select
                labelId="source-account"
                name="accountId"
                autoWidth={true}
                value={investment.accountId}
                onChange={handleChangeField}
              >
                <MenuItem value={emptyGuid}>None</MenuItem>
                {props.accounts ? props.accounts.map(a =>
                  <MenuItem value={a.accountId} key={a.accountId}>{a.name}</MenuItem>
                ) : <MenuItem>Select...</MenuItem>
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              value={investment.description}
              onChange={handleChangeField}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={saveInvestment}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

