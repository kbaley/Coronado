import React, { Component } from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { DecimalFormat, MoneyFormat } from '../common/DecimalFormat';
import * as transactionActions from '../../actions/transactionActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CategorySelect } from '../common/CategorySelect';
import './TransactionRow.css';
import { CheckIcon } from '../icons/CheckIcon';
import { CancelIcon } from '../icons/CancelIcon';
import { MoneyInput } from '../common/MoneyInput';
import * as Mousetrap from 'mousetrap';
import { getCategoriesForDropdown } from "../../selectors/selectors.js";
import VendorField from '../common/VendorField';

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
    return (
      this.state.isEditing ? 
      <tr className="transactionRow">
        <td>
          <CheckIcon onClick={this.updateTransaction} className="icon" />
          <CancelIcon onCancel={this.cancelEditing} />
        </td>
        <td>
        <input type="text" name="transactionDate" 
          onChange={this.handleChangeField}
          onKeyPress={this.handleKeyPress}
          value={this.state.trx.transactionDate} />
        </td>
        <td>
          <VendorField vendors={this.props.vendors} value={this.state.trx.vendor} onVendorChanged={this.handleChangeVendor} />
        </td>
        <td>
            <CategorySelect 
              selectedCategory={this.state.selectedCategory} 
              categories={this.props.categories}
              selectedAccount={trx.accountId}
              onCategoryChanged={this.handleChangeCategory} />
        </td>
        <td>
            <input type="text" name="description" onChange={this.handleChangeField}
                value={this.state.trx.description} onKeyPress={this.handleKeyPress} />
        </td>
        <td>
          <MoneyInput name="debit" value={this.state.trx.debit} 
            onChange={this.handleChangeField} onKeyPress={this.handleKeyPress} />
        </td>
        <td>
          <MoneyInput name="credit" value={this.state.trx.credit} 
            onChange={this.handleChangeField} onKeyPress={this.handleKeyPress} /></td>
        <td></td>
      </tr> :

      <tr>
        <td>
            <EditIcon onStartEditing={this.startEditing} className="icon" />
            <DeleteIcon onDelete={this.props.onDelete} />
        </td>
        <td>{new Date(trx.transactionDate).toLocaleDateString()}</td>
        <td title={trx.vendor}>{trx.vendor}</td>
        <td title={trx.categoryDisplay}>{trx.categoryDisplay}</td>
        <td title={trx.description}>{trx.description}</td>
        <td><DecimalFormat isDebit={true} amount={trx.debit} /></td>
        <td><DecimalFormat isCredit={true} amount={trx.credit} /></td>
        <td><MoneyFormat amount={trx.runningTotal} /></td>
      </tr>
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
)(TransactionRow);