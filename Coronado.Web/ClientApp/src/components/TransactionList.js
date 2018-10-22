import React, { Component } from 'react';
import { actionCreators } from '../store/Account';
import { actionCreators as categoryActionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TransactionRow from './TransactionRow';
import './TransactionList.css';
import { NewTransactionRow } from './NewTransactionRow';
import { each } from 'lodash';

class TransactionList extends Component {
  displayName = TransactionList.name;
  constructor(props) {
    super(props);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.saveTransaction = this.saveTransaction.bind(this);
    this.state = {
      categories: []
    }
  }

  componentDidMount() {
      this.props.requestCategories();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.categories.length === this.props.categories.length) return;

    var categories = this.props.categories.slice();
    each(this.props.accounts, a => {
      categories.push({categoryId: 'TRF:' + a.accountId, name: 'TRANSFER: ' + a.name});
    });

    this.setState({categories});    
  }

  deleteTransaction(transactionId) {
      this.props.deleteTransaction(transactionId);
  }

  saveTransaction(trx, transactionType) {
    this.props.saveTransaction(trx, transactionType);
  }

  render() {
    return (<table className='table transactionList'>
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
        <NewTransactionRow 
          onSave={this.saveTransaction} 
          categories={this.state.categories}
          accountId={this.props.accountId} />
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