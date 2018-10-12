import React, { Component } from 'react';
import Select from 'react-select';
import { Glyphicon } from 'react-bootstrap';
import { actionCreators } from '../store/Account';
import { actionCreators as categoryActionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import TransactionRow from './TransactionRow';
import './TransactionList.css';

class TransactionList extends Component {
  displayName = TransactionList.name;
  constructor(props) {
    super(props);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.saveTransaction = this.saveTransaction.bind(this);
    this.handleChangeDebit = this.handleChangeDebit.bind(this);
    this.handleChangeCredit = this.handleChangeCredit.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.state = {
      trx: {
        transactionDate: new Date().toLocaleDateString(), 
        vendor: '', 
        description: '',
        accountId: props.accountId
      },
      categories: [],
      selectedCategory: null
    }
  }

  componentDidMount() {
      Mousetrap.bind('n t', this.setFocus);
      this.props.requestCategories();
  }

  componentWillUnmount() {
    Mousetrap.unbind('n t');
  }

  setFocus(e) {
    e.preventDefault();
    this.refs["inputDate"].focus();
    return false;
  }

  deleteTransaction(transactionId) {
      this.props.deleteTransaction(transactionId);
  }

  saveTransaction() {
    this.props.saveTransaction(this.state.trx);
    this.setState(...this.state, 
      {
        trx: {...this.state.trx, vendor: '', categoryId: null, description: '', amount: '', debit: '', credit: ''},
        selectedCategory : null
      });
    this.refs["inputDate"].focus();
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

  handleChangeCategory(selectedOption) {
    this.setState( {trx: {...this.state.trx, categoryId: selectedOption.value }});
    this.setState( { selectedCategory: selectedOption });
  }

  handleChangeDebit(e) {
    if (e.targetValue !== '') {
      var amount = 0 - parseFloat(e.target.value);
      this.setState( { trx: {...this.state.trx, amount: amount}});
    }
  }

  handleChangeCredit(e) {
    if (e.targetValue !== '') {
      var amount = parseFloat(e.target.value);
      this.setState( { trx: {...this.state.trx, amount: amount}});
    }
  }

  static getDerivedStateFromProps(props, state) {
    var categories = props.categories.map( c => {
      return { value: c.categoryId, label: c.name }
    });
    return {
      ...state,
      categories
    }
  }

  render() {
    const customStyles = {
      option: (base) => ({
        ...base,
      }),
      control: (base) => ({
        // none of react-selects styles are passed to <View />
        ...base,
        width: 200,
        minHeight: 27,
        height: 27,
        borderRadius: 0
      })
    }

    return (<table className='table'>
      <thead>
        <tr>
          <th></th>
          <th>Date</th>
          <th>Vendor</th>
          <th>Category</th>
          <th>Description</th>
          <th>Debit</th>
          <th>Credit</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr key="new-transaction">
          <td>
            <Glyphicon glyph="ok" style={{color: "green", cursor: "pointer"}} onClick={this.saveTransaction} />
          </td>
          <td><input type="text" name="transactionDate" ref="inputDate"
            value={this.state.trx.transactionDate} onChange={this.handleChangeField}/></td>
          <td><input type="text" name="vendor" value={this.state.trx.vendor} onChange={this.handleChangeField} /></td>
          <td>
            <Select value={this.state.selectedCategory} onChange={this.handleChangeCategory}
              options={this.state.categories} styles={customStyles}  />
            </td>
          <td><input type="text" name="description" value={this.state.trx.description} onChange={this.handleChangeField} /></td>
          <td><input type="text" name="debit" value={this.state.debit} 
            onChange={this.handleChangeDebit} onKeyPress={this.handleKeyPress} /></td>
          <td><input type="text" name="credit" value={this.state.credit} 
            onChange={this.handleChangeCredit} onKeyPress={this.handleKeyPress} /></td>
            <td></td>
        </tr>
        {this.props.transactions ? this.props.transactions.map(trx => 
        <TransactionRow key={trx.transactionId} transaction={trx} categories={this.state.categories}
          onDelete={() => this.deleteTransaction(trx.transactionId)} />
        ) : <tr/>}
      </tbody>
    </table>);
  }
}

export default connect(
  state => { return { ...state.account, ...state.categories } },
  dispatch => bindActionCreators({ ...actionCreators, ...categoryActionCreators }, dispatch)
)(TransactionList);