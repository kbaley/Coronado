import React, { Component } from 'react';
import { CheckIcon } from './icons/CheckIcon';
import * as Mousetrap from 'mousetrap';
import { CategorySelect } from './CategorySelect';
import { find } from 'lodash';

export class NewTransactionRow extends Component {
  constructor(props) {
    super(props);
    this.saveTransaction = this.saveTransaction.bind(this);
    this.handleChangeDebit = this.handleChangeDebit.bind(this);
    this.handleChangeCredit = this.handleChangeCredit.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this); 
    this.setFocus = this.setFocus.bind(this);

    this.state = {
      trx: {
        transactionDate: new Date().toLocaleDateString(), 
        vendor: '', 
        description: '',
        accountId: props.accountId
      },
      credit: '',
      debit: '',
      selectedCategory: {},
      categories: []
    }
  }

  componentDidMount() {
      Mousetrap.bind('n t', this.setFocus);
  }

  componentWillUnmount() {
    Mousetrap.unbind('n t');
  }

  setFocus(e) {
    e.preventDefault();
    this.refs["inputDate"].focus();
    return false;
  }

  handleChangeField(e) {
    var name = e.target.name;
    this.setState( { trx: {...this.state.trx, [name]: e.target.value } } );
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.saveTransaction();
    }
  }

  handleChangeCategory(categoryId) {
    var selectedCategory = find(this.props.categories, c => c.categoryId===categoryId);
    this.setState( {
      trx: {...this.state.trx, categoryId },
      selectedCategory});
  }

  handleChangeDebit(e) {
    if (e.targetValue !== '') {
      var amount = 0 - parseFloat(e.target.value);
      this.setState( { trx: {...this.state.trx, amount: amount}, debit: e.target.value});
    }
  }

  handleChangeCredit(e) {
    if (e.targetValue !== '') {
      var amount = parseFloat(e.target.value);
      this.setState( { trx: {...this.state.trx, amount: amount}, credit: e.target.value});
    }
  }

  saveTransaction() {
    this.props.onSave(this.state.trx);
    this.setState( 
      { trx: 
        { ...this.state.trx, vendor: '', description: '', amount: '' }, 
        selectedCategory: { }, 
        credit: '', 
        debit: ''  
      }
    );
  }
  render() {
    return (
      <tr key="new-transaction">
        <td>
          <CheckIcon onClick={this.saveTransaction} />
        </td>
        <td><input type="text" name="transactionDate" ref="inputDate"
          value={this.state.trx.transactionDate} onChange={this.handleChangeField}/></td>
        <td><input type="text" name="vendor" value={this.state.trx.vendor} onChange={this.handleChangeField} /></td>
        <td>
          <CategorySelect selectedCategory={this.state.selectedCategory}
            onCategoryChanged={this.handleChangeCategory} categories={this.props.categories} />
        </td>
        <td><input type="text" name="description" value={this.state.trx.description} onChange={this.handleChangeField} /></td>
        <td><input type="text" name="debit" value={this.state.debit} 
          onChange={this.handleChangeDebit} onKeyPress={this.handleKeyPress} /></td>
        <td><input type="text" name="credit" value={this.state.credit} 
          onChange={this.handleChangeCredit} onKeyPress={this.handleKeyPress} /></td>
          <td></td>
      </tr>
    )
  }
}