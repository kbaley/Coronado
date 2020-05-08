import React, { Component } from 'react';
import { DecimalFormat, MoneyFormat } from '../common/DecimalFormat';
import * as transactionActions from '../../actions/transactionActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CategorySelect } from '../common/CategorySelect';
import { CheckIcon } from '../icons/CheckIcon';
import { CancelIcon } from '../icons/CancelIcon';
import { MoneyInput } from '../common/MoneyInput';
import * as Mousetrap from 'mousetrap';
import { getCategoriesForDropdown } from "../../selectors/selectors.js";
import VendorField from '../common/VendorField';
import { TableRow, TableCell, withStyles, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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

class TransactionRow extends Component {
  constructor(props) {
    super(props);
    this.startEditing = this.startEditing.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.cancelEditing = this.cancelEditing.bind(this);
    this.handleChangeVendor = this.handleChangeVendor.bind(this);
    this.state = { isEditing: false, 
        selectedCategory: { },
        trx: {...props.transaction, 
            vendor: props.transaction.vendor || '',
            description: props.transaction.description || '',
            transactionDate: new Date(props.transaction.transactionDate).toLocaleDateString(),
            categoryId: props.transaction.categoryId,
            debit: props.transaction.debit ? Number(props.transaction.debit).toFixed(2) : '',
            credit: props.transaction.credit ? Number(props.transaction.credit).toFixed(2) : '',
            categoryName: props.transaction.categoryDisplay } };
  }

  startEditing() {
    this.setState({
        isEditing: true,
        selectedCategory: this.props.transaction.categoryId,
    });
    Mousetrap.bind('esc', this.cancelEditing);
  }

  cancelEditing() {
    this.setState({isEditing: false});
    Mousetrap.unbind('esc');
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.updateTransaction();
    }
  }

  handleChangeVendor(vendorName) {
    let categoryId = this.state.trx.categoryId;
    let categoryDisplay = this.state.trx.categoryDisplay;
    let selectedCategory = this.state.selectedCategory;
    const vendor = this.props.vendors.find(v => v.name === vendorName);
    if (vendor) {
      const category = this.props.categories.find(c => c.categoryId === vendor.lastTransactionCategoryId);
      if (category) {
        categoryId = category.categoryId;
        categoryDisplay = category.name;
        selectedCategory = category;
      }
    }
    this.setState({ 
      trx: {
        ...this.state.trx, 
        vendor: vendorName,
        categoryId,
        categoryDisplay
      },
      selectedCategory
    });
  }

  handleChangeField(e) {
    var name = e.target.name;
    this.setState( { trx: {...this.state.trx, [name]: e.target.value } } );
  }

  handleChangeCategory(category) {
    this.setState( {
      trx: {...this.state.trx, categoryId: category.categoryId },
      selectedCategory: category.categoryId
    });
  }

  updateTransaction() {
    this.props.actions.updateTransaction(this.state.trx);
    this.setState({isEditing: false});

  }

  render() {
    const trx = this.props.transaction;
    const { classes } = this.props;
    return (
      this.state.isEditing ? 
      <TableRow>
        <TableCell>
          <CheckIcon onClick={this.updateTransaction} className="icon" />
          <CancelIcon onCancel={this.cancelEditing} />
        </TableCell>
        <TableCell>
        <input type="text" name="transactionDate" 
          onChange={this.handleChangeField}
          className={classes.input}
          onKeyPress={this.handleKeyPress}
          value={this.state.trx.transactionDate} />
        </TableCell>
        <TableCell>
          <VendorField vendors={this.props.vendors} value={this.state.trx.vendor} onVendorChanged={this.handleChangeVendor} />
        </TableCell>
        <TableCell>
            <CategorySelect 
              selectedCategory={this.state.selectedCategory} 
              categories={this.props.categories}
              selectedAccount={trx.accountId}
              onCategoryChanged={this.handleChangeCategory} />
        </TableCell>
        <TableCell>
            <input type="text" name="description" onChange={this.handleChangeField}
          className={classes.input}
                value={this.state.trx.description} onKeyPress={this.handleKeyPress} />
        </TableCell>
        <TableCell>
          <MoneyInput name="debit" value={this.state.trx.debit} className={classes.input} 
            onChange={this.handleChangeField} onKeyPress={this.handleKeyPress} />
        </TableCell>
        <TableCell>
          <MoneyInput name="credit" value={this.state.trx.credit} className={classes.input}
            onChange={this.handleChangeField} onKeyPress={this.handleKeyPress} /></TableCell>
        <TableCell></TableCell>
      </TableRow> :

      <TableRow>
        <TableCell>
            <IconButton onClick={this.props.onDelete} component="span">
              <EditIcon className={classes.icon} fontSize="small" />
            </IconButton>
            <IconButton onClick={this.props.onDelete} component="span">
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
}

function mapStateToProps(state) {
  return { 
    categories: getCategoriesForDropdown(state.categories, state.accounts, state.invoices),
    vendors: state.vendors
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(transactionActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TransactionRow));