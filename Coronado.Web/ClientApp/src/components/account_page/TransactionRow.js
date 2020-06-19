import React from 'react';
import { DecimalFormat, MoneyFormat } from '../common/DecimalFormat';
import * as transactionActions from '../../actions/transactionActions';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../common/CategorySelect';
import * as Mousetrap from 'mousetrap';
import { getCategoriesForDropdown } from "../../selectors/selectors.js";
import VendorField from '../common/VendorField';
import { TableRow, TableCell, IconButton, makeStyles, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check'
import CancelIcon from '@material-ui/icons/Cancel'

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
  const [selectedCategory, setSelectedCategory] = React.useState({});
  const [trx, setTrx] = React.useState({
    ...props.transaction,
    vendor: props.transaction.vendor || '',
    description: props.transaction.description || '',
    transactionDate: new Date(props.transaction.transactionDate).toLocaleDateString(),
    categoryId: props.transaction.categoryId,
    debit: props.transaction.debit ? Number(props.transaction.debit).toFixed(2) : '',
    credit: props.transaction.credit ? Number(props.transaction.credit).toFixed(2) : '',
    categoryName: props.transaction.categoryDisplay,
  });
  const vendors = useSelector(state => state.vendors);
  const categories = useSelector(state => getCategoriesForDropdown(state.categories, state.accounts, state.invoices));
  const dispatch = useDispatch();

  const startEditing = () => {
    setIsEditing(true);
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
    let vendorName = vendor;
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
    setTrx({
      ...trx,
      categoryId: category.categoryId,
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
      <TableRow>
        <TableCell>
          <IconButton onClick={updateTransaction} component="span">
            <CheckIcon className={classes.icon} fontSize="small" />
          </IconButton>
          <IconButton onClick={cancelEditing} component="span">
            <CancelIcon className={classes.icon} fontSize="small" />
          </IconButton>
        </TableCell>
        <TableCell>
          <TextField 
            name="transactionDate"
            onChange={handleChangeField}
            className={classes.input}
            onKeyPress={handleKeyPress}
            value={trx.transactionDate} />
        </TableCell>
        <TableCell>
          <VendorField 
            vendors={vendors} 
            value={trx.vendor} 
            className={classes.input}
            onVendorChanged={handleChangeVendor} 
          />
        </TableCell>
        <TableCell>
          <CategorySelect
            selectedCategory={selectedCategory}
            categories={categories}
            selectedAccount={trx.accountId}
            onCategoryChanged={handleChangeCategory} />
        </TableCell>
        <TableCell>
          <TextField 
            name="description" 
            onChange={handleChangeField}
            fullWidth
            className={classes.input}
            value={trx.description} 
            onKeyPress={handleKeyPress} 
          />
        </TableCell>
        <TableCell>
          <TextField 
            name="debit" 
            value={trx.debit} 
            className={classes.input}
            inputProps={{ style:{ textAlign: 'right'}}}
            onChange={handleChangeField} 
            onKeyPress={handleKeyPress} />
        </TableCell>
        <TableCell>
          <TextField 
            name="credit" 
            value={trx.credit} 
            className={classes.input}
            inputProps={{ style:{ textAlign: 'right'}}}
            onChange={handleChangeField} 
            onKeyPress={handleKeyPress} 
          /></TableCell>
        <TableCell></TableCell>
      </TableRow> :

      <TableRow>
        <TableCell>
          <IconButton onClick={startEditing} component="span">
            <EditIcon className={classes.icon} fontSize="small" />
          </IconButton>
          <IconButton onClick={props.onDelete} component="span">
            <DeleteIcon className={classes.icon} fontSize="small" />
          </IconButton>
        </TableCell>
        <TableCell>{new Date(trx.transactionDate).toLocaleDateString()}</TableCell>
        <TableCell title={trx.vendor} className={classes.overflow}>{trx.vendor}</TableCell>
        <TableCell title={trx.categoryDisplay} className={classes.overflow}>{trx.categoryDisplay}</TableCell>
        <TableCell title={trx.description}>{trx.description}</TableCell>
        <TableCell><DecimalFormat isDebit={true} amount={trx.debit} /></TableCell>
        <TableCell><DecimalFormat isCredit={true} amount={trx.credit} /></TableCell>
        <TableCell><MoneyFormat amount={trx.runningTotal} /></TableCell>
      </TableRow>
  );
}
