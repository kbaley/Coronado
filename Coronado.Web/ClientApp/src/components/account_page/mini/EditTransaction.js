import React from 'react';
import { makeStyles, Grid, TextField, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import VendorField from '../../common/VendorField';
import { useSelector } from 'react-redux';
import CategorySelect from '../../common/CategorySelect';
import { getCategoriesForDropdown } from "../../../selectors/selectors";
import { find } from 'lodash';

const styles = theme => ({
});

const useStyles = makeStyles(styles);

export default function EditTransaction(props) {

  const today = new Date().toISOString().split('T')[0];
  const vendors = useSelector(state => state.vendors);
  const categories = useSelector(state => getCategoriesForDropdown(state.categories, state.accounts, state.invoices));
  // const categories = [{
  //   categoryId: "123123123",
  //   name: "My category"
  // }]
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [transactionType, setTransactionType] = React.useState("REGULAR");
  const [mortgageType, setMortgageType] = React.useState('');
  const [mortgagePayment, setMortgagePayment] = React.useState('');
  const accounts = useSelector(state => state.accounts);
  const [trx, setTrx] = React.useState({
    transactionDate: new Date().toLocaleDateString(),
    vendor: '',
    description: '',
    accountId: props.account.accountId,
    credit: '',
    debit: '',
    invoiceId: '',
    transactionType: 'REGULAR',
  });

  React.useEffect(() => {
    if (props.account && props.account.accountId !== trx.accountId) {
      setTrx({
        ...trx,
        accountId: props.account.accountId,
      });
    }

  }, [props.account, trx]);

  const handleChangeField = (e) => {
    const name = e.target.name;
    setTrx({
      ...trx,
      [name]: e.target.value,
    })
  }

  const handleChangeCategory = (selectedCategory) => {
    if (selectedCategory === null) {
      // Category cleared
      setTrx({
        ...trx,
        categoryId: '',
        categoryDisplay: '',
      });
      setSelectedCategory('');
      return;
    }
    if (selectedCategory.isNew) {
      setTrx({
        ...trx,
        categoryId: '',
        categoryDisplay: selectedCategory.name,
        categoryName: selectedCategory.name,
      });
      setSelectedCategory(selectedCategory);
      return;
    }

    // Handle special categories
    let categoryId = selectedCategory.categoryId;
    let transactionType = "REGULAR";
    let mortgageType = '';
    let mortgagePayment = '';
    let invoiceId = '';
    let categoryDisplay = selectedCategory.name;
    let debit = trx.debit;
    let credit = trx.credit;
    let relatedAccountId = '';
    if (categoryId.substring(0, 4) === "TRF:") {
      transactionType = "TRANSFER";
      relatedAccountId = categoryId.substring(4);
      categoryId = '';
    } else if (categoryId.substring(0, 4) === "MRG:") {
      transactionType = "MORTGAGE_PAYMENT";
      relatedAccountId = categoryId.substring(4);
      const relatedAccount = find(accounts, a => a.accountId === relatedAccountId);
      categoryId = '';
      debit = relatedAccount.mortgagePayment || '';
      mortgageType = relatedAccount.mortgageType;
      mortgagePayment = relatedAccount.mortgagePayment;
    } else if (categoryId.substring(0, 4) === "PMT:") {
      transactionType = "INVOICE_PAYMENT";

      invoiceId = selectedCategory.invoiceId;
      categoryId = '';
      credit = selectedCategory.balance;
    }
    setTrx({
      ...trx,
      categoryId,
      debit,
      credit,
      categoryDisplay,
      invoiceId,
      relatedAccountId,
      transactionType,
    });
    setTransactionType(transactionType);
    setMortgageType(mortgageType);
    setMortgagePayment(mortgagePayment);
    setSelectedCategory(selectedCategory);
  }


  const handleChangeVendor = (vendor) => {
    let categoryId = trx.categoryId;
    let categoryDisplay = trx.categoryDisplay;
    let localSelectedCategory = selectedCategory;
    let newVendor = Object.assign({}, vendor);
    let vendorName = vendor || "";
    if (vendorName.name) {
      // This is a vendor selected from the list
      vendorName = vendor.name;
    } else {
      // This is not a vendor selected from the list
      // See if it exists in our vendor list
      newVendor = vendors.find(v => v.name === vendorName);
    }
    if (newVendor) {
      const category = categories.find(c => c.categoryId === vendor.lastTransactionCategoryId);
      if (category) {
        categoryId = category.categoryId;
        categoryDisplay = category.name;
        localSelectedCategory = category;
      }
    }
    setTrx({
      ...trx,
      vendor: vendorName,
      categoryId,
      categoryDisplay,
    });
    setSelectedCategory(localSelectedCategory);
  }

  const handleChangeDebit = (e) => {
    let credit = '';
    const debit = e.target.value;
    if (transactionType === "MORTGAGE_PAYMENT" && mortgageType === 'fixedPayment' && debit !== '') {
      credit = mortgagePayment - Number(debit);
    }
    setTrx({
      ...trx,
      debit,
      credit,
    });
  }

  const classes = useStyles();

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <TextField
          label="Transaction date"
          type="date"
          defaultValue={today}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12}>

        <VendorField
          vendors={vendors}
          label="Vendor"
          margin="normal"
          onVendorChanged={handleChangeVendor}
        />
      </Grid>
      <Grid item xs={12}>

        <CategorySelect
          label="Category"
          margin="normal"
          categories={categories}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="description"
          fullWidth={true}
          margin="normal"
          label="Description"
          value={trx.description}
          onChange={handleChangeField}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="debit"
          label="Debit"
          fullWidth={true}
          margin="normal"
          className={classes.input}
          value={trx.debit}
          onChange={handleChangeDebit}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="credit"
          label="Credit"
          fullWidth={true}
          margin="normal"
          className={classes.input}
          value={trx.credit}
          onChange={handleChangeField}
        />
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          startIcon={<CancelIcon />}
        >
          Cancel
          </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save
          </Button>
      </Grid>
    </Grid>
  )
}
