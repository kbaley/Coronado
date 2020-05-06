import React, { Component } from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
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
import { TableRow, TableCell, withStyles } from '@material-ui/core';
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";

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
    console.log(classes.tableBodyRow);
    return (
      this.state.isEditing ? 
      <TableRow className={classes.tableBodyRow}>
        <TableCell className={classes.tableCell}>
          <CheckIcon onClick={this.updateTransaction} className="icon" />
          <CancelIcon onCancel={this.cancelEditing} />
        </TableCell>
        <TableCell className={classes.tableCell}>
        <input type="text" name="transactionDate" 
          onChange={this.handleChangeField}
          onKeyPress={this.handleKeyPress}
          value={this.state.trx.transactionDate} />
        </TableCell>
        <TableCell className={classes.tableCell}>
          <VendorField vendors={this.props.vendors} value={this.state.trx.vendor} onVendorChanged={this.handleChangeVendor} />
        </TableCell>
        <TableCell className={classes.tableCell}>
            <CategorySelect 
              selectedCategory={this.state.selectedCategory} 
              categories={this.props.categories}
              selectedAccount={trx.accountId}
              onCategoryChanged={this.handleChangeCategory} />
        </TableCell>
        <TableCell className={classes.tableCell}>
            <input type="text" name="description" onChange={this.handleChangeField}
                value={this.state.trx.description} onKeyPress={this.handleKeyPress} />
        </TableCell>
        <TableCell className={classes.tableCell}>
          <MoneyInput name="debit" value={this.state.trx.debit} 
            onChange={this.handleChangeField} onKeyPress={this.handleKeyPress} />
        </TableCell>
        <TableCell className={classes.tableCell}>
          <MoneyInput name="credit" value={this.state.trx.credit} 
            onChange={this.handleChangeField} onKeyPress={this.handleKeyPress} /></TableCell>
        <TableCell className={classes.tableCell}></TableCell>
      </TableRow> :

      <TableRow className={classes.tableBodyRow}>
        <TableCell className={classes.tableCell}>
            <EditIcon onStartEditing={this.startEditing} className="icon" />
            <DeleteIcon onDelete={this.props.onDelete} />
        </TableCell>
        <TableCell className={classes.tableCell}>{new Date(trx.transactionDate).toLocaleDateString()}</TableCell>
        <TableCell title={trx.vendor} className={classes.tableCell}>{trx.vendor}</TableCell>
        <TableCell title={trx.categoryDisplay} className={classes.tableCell}>{trx.categoryDisplay}</TableCell>
        <TableCell title={trx.description} className={classes.tableCell}>{trx.description}</TableCell>
        <TableCell className={classes.tableCell}><DecimalFormat isDebit={true} amount={trx.debit} /></TableCell>
        <TableCell className={classes.tableCell}><DecimalFormat isCredit={true} amount={trx.credit} /></TableCell>
        <TableCell className={classes.tableCell}><MoneyFormat amount={trx.runningTotal} /></TableCell>
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