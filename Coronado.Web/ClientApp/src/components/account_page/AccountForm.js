import React from 'react';
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

export default function AccountForm(props) {
  const [ newAccount, setNewAccount ] = React.useState(true);
  const [ account, setAccount ] = React.useState({
        name: '', 
        vendor: '', 
        startingBalance: 0, 
        currency: 'USD', 
        mortgageType: 'fixedPayment',
        mortgagePayment: '',
        accountType: 'Cash',
        startDate: new Date().toLocaleDateString()
  });

  React.useEffect(() => {
    
    if (props.account && props.account.accountId !== account.accountId) {
      setNewAccount(false);
      setAccount({
          accountId: props.account.accountId,
          name: props.account.name,
          vendor: props.account.vendor || '',
          currency: props.account.currency || '',
          accountType: props.account.accountType || '',
          mortgageType: props.account.mortgageType || '',
          mortgagePayment: props.account.mortgagePayment || '',
          isHidden: props.account.isHidden
      });
    }
  }, [props.account, account.accountId]);

  const handleChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    if (e.target.type === "checkbox")
      value = e.target.checked;
    setAccount({
      ...account,
      [name]: value,
    });
  }

  const handleChangeType = (e) => {
    setAccount({
      ...account,
      accountType: e.target.value,
    })
  }

  const handleChangeMortgageType = (_, newMortgageType) => {
    setAccount({
      ...account,
      mortgageType: newMortgageType,
    })
  }

  const onSave = () => {
    props.onSave(account);
    if (newAccount)
    {
      setAccount({
        ...account,
        name: '',
        startingBalance: 0,
        currency: 'USD',
        vendor: ''
      });
    }
    props.onClose();
  }
    return (
    <Dialog 
      maxWidth="sm" 
      fullWidth={true}
      open={props.show} 
      onClose={props.onClose}
    >
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              autoFocus
              name="name"
              label="Account Name"
              fullWidth={true}
              value={account.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="vendor"
              label="Vendor"
              fullWidth={true}
              value={account.vendor}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl>
            <InputLabel id="account-type">Account Type</InputLabel>
            <Select
              labelId="account-type"
              value={account.accountType}
              style={{minWidth: 100}}
              onChange={handleChangeType}
            >
              {props.accountTypes ? props.accountTypes.map((t,i) => 
              <MenuItem key={i} value={t}>{t}</MenuItem>
              ) : <MenuItem>Select...</MenuItem>}
            </Select>
            </FormControl>
          </Grid>
          {newAccount &&
          <Grid item xs={4}>
              <TextField
                fullWidth={true}
                name="startingBalance"
                label="Starting Balance"
                value={account.startingBalance}
                onChange={handleChange}
              />
          </Grid>
          }
          {newAccount &&
          <Grid item xs={4}>
              <TextField
                fullWidth={true}
                name="startDate"
                label="Starting Date"
                value={account.startDate}
                onChange={handleChange}
              />
          </Grid>
          }
          <Grid item xs={4}>
            <TextField
              name="currency"
              label="Currency"
              value={account.currency}
              onChange={handleChange}
            />
          </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name='isHidden'
                    checked={account.isHidden}
                    onChange={handleChange}
                  />
                }
                label="Account is hidden"
              />
            </Grid>
            {account.accountType === "Mortgage" &&
            <React.Fragment>
            <Grid item xs={4}>
              <TextField
                name="mortgagePayment"
                label="Mortgage Payment"
                fullWidth={true}
                value={account.mortgagePayment}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8}>
                <ToggleButtonGroup 
                  exclusive
                  value={account.mortgageType} 
                  onChange={handleChangeMortgageType} 
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
        <Button onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
    );
}