import React from 'react';
import { CheckIcon } from '../icons/CheckIcon';
import { CategorySelect } from '../common/CategorySelect';
import { find } from 'lodash';
import * as transactionActions from '../../actions/transactionActions';
import { useSelector, useDispatch } from 'react-redux';
import { getCategoriesForDropdown } from "../../selectors/selectors";
import VendorField from '../common/VendorField';
import { TableRow, TableCell, makeStyles } from '@material-ui/core';

const styles = theme => ({
  input: {
    height: 27,
    fontSize: 14,
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  }
});

const useStyles = makeStyles(styles);

export default function NewTransactionRow(props) {
  const [ trx, setTrx ] = React.useState({
        transactionDate: new Date().toLocaleDateString(),
        vendor: '',
        description: '',
        accountId: props.account.accountId,
        credit: '',
        debit: '',
        invoiceId: '',
        transactionType: 'REGULAR',
  });
  const [ selectedCategory, setSelectedCategory ] = React.useState({});
  const [ transactionType, setTransactionType ] = React.useState("REGULAR");
  const [ mortgageType, setMortgageType ] = React.useState('');
  const [ mortgagePayment, setMortgagePayment ] = React.useState('');
  const categories = useSelector(state => getCategoriesForDropdown(state.categories, state.accounts, state.invoices));
  const accounts = useSelector(state => state.accounts);
  const vendors = useSelector(state => state.vendors);
  const dispatch = useDispatch();  
  
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTransaction();
    }
  }

  const handleChangeVendor = (vendorName) => {
    let categoryId = trx.categoryId;
    let categoryDisplay = trx.categoryDisplay;
    let localSelectedCategory = selectedCategory;
    const vendor = vendors.find(v => v.name === vendorName);
    if (vendor) {
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

  const handleChangeCategory = (selectedCategory) => {
    if (selectedCategory === null) {
      // Category cleared
      setTrx({
        ...trx,
        categoryId: '',
        categoryDisplay: '',
      });
      setSelectedCategory({});
      return;
    }
    if (selectedCategory.id) {
      // New category
      setTrx({
        ...trx,
        categoryId: '',
        categoryDisplay: selectedCategory.name,
        categoryName: selectedCategory.name,
      });
      setSelectedCategory(selectedCategory);
      return;
    }
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
    }
    if (categoryId.substring(0, 4) === "MRG:") {
      transactionType = "MORTGAGE_PAYMENT";
      relatedAccountId = categoryId.substring(4);
      const relatedAccount = find(accounts, a => a.accountId === relatedAccountId);
      categoryId = '';
      debit = relatedAccount.mortgagePayment || '';
      mortgageType = relatedAccount.mortgageType;
      mortgagePayment = relatedAccount.mortgagePayment;
    }
    if (categoryId.substring(0, 4) === "PMT:") {
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

  const saveTransaction = () => {
    dispatch(transactionActions.createTransaction(trx));

    setTrx({
      ...trx,
      vendor: '',
      description: '',
      debit: '',
      credit: '',
      invoiceId: '',
      categoryId: '',
      categoryDisplay: '',
      relatedAccountId: '',
    });
    setSelectedCategory({ value: null });
    setTransactionType('REGULAR');
  }

  const classes = useStyles();

    return (
      <TableRow>
        <TableCell>
          <CheckIcon onClick={saveTransaction} />
        </TableCell>
        <TableCell><input type="text" name="transactionDate" className={classes.input}
          value={trx.transactionDate} onChange={handleChangeField} /></TableCell>
        <TableCell>
          <VendorField vendors={vendors} value={trx.vendor} onVendorChanged={handleChangeVendor} />
        </TableCell>
        <TableCell>
          <CategorySelect
            selectedCategory={selectedCategory}
            onCategoryChanged={handleChangeCategory}
            selectedAccount={trx.accountId}
            categories={categories} />
        </TableCell>
        <TableCell>
          <input 
            type="text" 
            name="description" 
            className={classes.input}
            value={trx.description} 
            onChange={handleChangeField} 
          />
        </TableCell>
        <TableCell>
          <input 
            type="text" 
            name="debit" 
            className={classes.input}
            value={trx.debit}
            onChange={handleChangeDebit} 
            onKeyPress={handleKeyPress} 
          />
        </TableCell>
        <TableCell>
          <input 
            type="text" 
            name="credit" 
            className={classes.input}
            value={trx.credit}
            onChange={handleChangeField} 
            onKeyPress={handleKeyPress} 
          />
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    )
}
