import React, { Component } from 'react';
import { DeleteIcon } from './icons/DeleteIcon';
import { EditIcon } from './icons/EditIcon';
import { DecimalFormat, MoneyFormat } from './DecimalFormat';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CategorySelect } from './CategorySelect';
import './TransactionRow.css';
import { find } from 'lodash';
import { CheckIcon } from './icons/CheckIcon';
import { CancelIcon } from './icons/CancelIcon';
import { MoneyInput } from './MoneyInput';
import * as Mousetrap from 'mousetrap';

class TransactionRow extends Component {
  constructor(props) {
    super(props);
    this.startEditing = this.startEditing.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeDebit = this.handleChangeDebit.bind(this);
    this.handleChangeCredit = this.handleChangeCredit.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.cancelEditing = this.cancelEditing.bind(this);
    this.state = { isEditing: false, 
        debit: '',
        credit: '',
        selectedCategory: { },
        trx: {...props.transaction, 
            vendor: props.transaction.vendor || '',
            transactionDate: new Date(props.transaction.transactionDate).toLocaleDateString(),
            categoryId: props.transaction.category ? props.transaction.category.categoryId : '',
            debit: props.transaction.debit,
            credit: props.transaction.credit,
            categoryName: props.transaction.category ? this.props.transaction.category.name : '' } };
  }

  startEditing() {
    const amount = this.state.trx.amount;
    this.setState({
        isEditing: true,
        // debit: amount <= 0 ? (0 - amount).toFixed(2) : '',
        // credit: amount > 0 ? amount.toFixed(2) : '',
        selectedCategory: find(this.props.categories, 
          c => c.categoryId === this.props.transaction.category ? this.props.transaction.category.categoryId : ''),
    });
    Mousetrap.bind('esc', this.cancelEditing);
  }

  cancelEditing() {
    this.setState({
      isEditing: false
    });
    Mousetrap.unbind('esc');
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.updateTransaction();
    }
  }

  handleChangeField(e) {
    var name = e.target.name;
    this.setState( { trx: {...this.state.trx, [name]: e.target.value } } );
  }

  handleChangeDebit(e) {
    if (e.targetValue !== '') {
      var amount = 0 - parseFloat(e.target.value);
      this.setState( { trx: {...this.state.trx, amount, debit: e.target.value } } );
    } else {
      this.handleChangeField();
    }
  }

  handleChangeCredit(e) {
    if (e.targetValue !== '') {
      var amount = parseFloat(e.target.value);
      this.setState( { trx: {...this.state.trx, amount: amount, credit: e.target.value}});
    } else {
      this.handleChangeField();
    }
  }

  handleChangeCategory(categoryId) {
    var selectedCategory = find(this.props.categories, c => c.categoryId===categoryId);
    this.setState( {
      trx: {...this.state.trx, categoryId },
      selectedCategory
    });
  }

  updateTransaction() {
    this.props.updateTransaction(this.state.trx);
    this.setState(...this.state, 
      {
        isEditing: false
      });

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
            <input type="text" name="vendor" onChange={this.handleChangeField}
                value={this.state.trx.vendor} onKeyPress={this.handleKeyPress} />
        </td>
        <td>
            <CategorySelect selectedCategory={this.state.selectedCategory} categories={this.props.categories}
              onCategoryChanged={this.handleChangeCategory} />
        </td>
        <td>
            <input type="text" name="description" onChange={this.handleChangeField}
                value={this.state.trx.description} onKeyPress={this.handleKeyPress} />
        </td>
        <td>
          <MoneyInput name="debit" value={this.state.trx.debit} 
            onChange={this.handleChangeDebit} onKeyPress={this.handleKeyPress} />
        </td>
        <td>
          <MoneyInput name="credit" value={this.state.trx.credit} 
            onChange={this.handleChangeCredit} onKeyPress={this.handleKeyPress} /></td>
        <td></td>
      </tr> :

      <tr>
        <td>
            <EditIcon onStartEditing={this.startEditing} className="icon" />
            <DeleteIcon onDelete={this.props.onDelete} />
        </td>
        <td>{new Date(trx.transactionDate).toLocaleDateString()}</td>
        <td>{trx.vendor}</td>
        <td>{trx.category ? trx.category.name : ''}</td>
        <td>{trx.description}</td>
        <td><DecimalFormat isDebit={true} amount={trx.debit} /></td>
        <td><DecimalFormat isCredit={true} amount={trx.credit} /></td>
        <td><MoneyFormat amount={trx.runningTotal} /></td>
      </tr>
    );
  }
}

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TransactionRow);