import React from 'react';
import { DecimalFormat, MoneyFormat } from '../common/DecimalFormat';
import * as transactionActions from '../../actions/transactionActions';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../common/CategorySelect';
import * as Mousetrap from 'mousetrap';
import { getCategoriesForDropdown } from "../../selectors/selectors.js";
import VendorField from '../common/VendorField';
import { IconButton, makeStyles, TextField, Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check'
import CancelIcon from '@material-ui/icons/Cancel'
import * as widths from './TransactionWidths';
import GridRow from '../common/grid/GridRow';
import GridItem from '../common/grid/GridItem';

const styles = theme => ({
  overflow: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  input: {
    height: 27,
    fontSize: 14,
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  },
  icon: {
    transform: "scale(1)",
  }
});

const useStyles = makeStyles(styles);

export default function TransactionRow(props) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [trx, setTrx] = React.useState({
    ...props.transaction,
    vendor: props.transaction.vendor || '',
    description: props.transaction.description || '',
    transactionDate: new Date(props.transaction.transactionDate).toLocaleDateString(),
    categoryId: (props.transaction.transactionType === 0) ? props.transaction.categoryId : '',
    debit: props.transaction.debit ? Number(props.transaction.debit).toFixed(2) : '',
    credit: props.transaction.credit ? Number(props.transaction.credit).toFixed(2) : '',
    categoryName: props.transaction.categoryDisplay,
  });
  const vendors = useSelector(state => state.vendors);
  const categories = useSelector(state => getCategoriesForDropdown(state.categories, state.accounts, state.invoices));
  const dispatch = useDispatch();

  React.useEffect(() => {
    var transaction = props.transaction;
    if (transaction) {
      setTrx({
        ...transaction,
        vendor: transaction.vendor || '',
        description: transaction.description || '',
        transactionDate: new Date(transaction.transactionDate).toLocaleDateString(),
        categoryId: (transaction.transactionType === 0) ? transaction.categoryId : '',
        debit: transaction.debit ? Number(transaction.debit).toFixed(2) : '',
        credit: transaction.credit ? Number(transaction.credit).toFixed(2) : '',
        categoryName: transaction.categoryDisplay,
      });
    }
  }, [props.transaction]);

  const startEditing = () => {
    setIsEditing(true);
    if (trx.transactionType !== 0) {
      setTrx({
        ...trx,
        categoryId: '',
      });
    }
    setSelectedCategory({
      categoryId: trx.categoryId,
      name: trx.categoryName
    })
    Mousetrap.bind('esc', cancelEditing);
  }

  const cancelEditing = () => {
    setIsEditing(false);
    Mousetrap.unbind('esc');
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateTransaction();
    }
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

  const handleChangeField = (e) => {
    var name = e.target.name;
    setTrx({
      ...trx,
      [name]: e.target.value,
    })
  }

  const handleChangeCategory = (category) => {
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
    let categoryId = category.categoryId;
    if (trx.transactionType !== 0) {
      categoryId = '';
    }
    setTrx({
      ...trx,
      categoryId: categoryId,
      categoryDisplay: category.name,
    });
    setSelectedCategory({
      categoryId: category.categoryId,
      name: category.name,
    })
  }

  const updateTransaction = () => {
    dispatch(transactionActions.updateTransaction(trx));
    setIsEditing(false);
  }

  const classes = useStyles();

  return (
    isEditing ?
      <GridRow xs={12}>
        <Grid xs={widths.ICON_WIDTH}>
          <IconButton onClick={updateTransaction} component="span">
            <CheckIcon className={classes.icon} fontSize="small" />
          </IconButton>
          <IconButton onClick={cancelEditing} component="span">
            <CancelIcon className={classes.icon} fontSize="small" />
          </IconButton>
        </Grid>
        <GridItem xs={widths.DATE_WIDTH}>
          <TextField
            name="transactionDate"
            onChange={handleChangeField}
            className={classes.input}
            onKeyPress={handleKeyPress}
            value={trx.transactionDate} />
        </GridItem>
        <GridItem xs={widths.VENDOR_WIDTH}>
          <VendorField
            vendors={vendors}
            value={trx.vendor}
            className={classes.input}
            onVendorChanged={handleChangeVendor}
          />
        </GridItem>
        <GridItem xs={widths.CATEGORY_WIDTH}>
          <CategorySelect
            className={classes.input}
            selectedCategory={selectedCategory}
            categories={categories}
            selectedAccount={trx.accountId}
            onCategoryChanged={handleChangeCategory} />
        </GridItem>
        <GridItem xs={widths.DESCRIPTION_WIDTH}>
          <TextField
            name="description"
            onChange={handleChangeField}
            fullWidth
            className={classes.input}
            value={trx.description}
            onKeyPress={handleKeyPress}
          />
        </GridItem>
        <GridItem xs={widths.DEBIT_WIDTH}>
          <TextField
            name="debit"
            value={trx.debit}
            className={classes.input}
            inputProps={{ style: { textAlign: 'right' } }}
            onChange={handleChangeField}
            onKeyPress={handleKeyPress} />
        </GridItem>
        <GridItem xs={widths.CREDIT_WIDTH}>
          <TextField
            name="credit"
            value={trx.credit}
            className={classes.input}
            inputProps={{ style: { textAlign: 'right' } }}
            onChange={handleChangeField}
            onKeyPress={handleKeyPress}
          />
        </GridItem>
        <GridItem xs={widths.BALANCE_WIDTH} />
      </GridRow> :

      <GridRow xs={12}>
        <Grid item xs={widths.ICON_WIDTH}>
          <IconButton onClick={startEditing} component="span">
            <EditIcon className={classes.icon} fontSize="small" />
          </IconButton>
          <IconButton onClick={props.onDelete} component="span">
            <DeleteIcon className={classes.icon} fontSize="small" />
          </IconButton>
        </Grid>
        <GridItem xs={widths.DATE_WIDTH}>{new Date(trx.transactionDate).toLocaleDateString()}</GridItem>
        <GridItem xs={widths.VENDOR_WIDTH}>{trx.vendor}</GridItem>
        <GridItem xs={widths.CATEGORY_WIDTH}>{trx.categoryDisplay}</GridItem>
        <GridItem xs={widths.DESCRIPTION_WIDTH}>{trx.description}</GridItem>
        <GridItem xs={widths.DEBIT_WIDTH}><DecimalFormat isDebit={true} amount={trx.debit} /></GridItem>
        <GridItem xs={widths.CREDIT_WIDTH}><DecimalFormat isCredit={true} amount={trx.credit} /></GridItem>
        <GridItem xs={widths.BALANCE_WIDTH}><MoneyFormat amount={trx.runningTotal} /></GridItem>
      </GridRow>
  );
}
