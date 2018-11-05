import React, { Component } from 'react';
import * as accountActions from '../actions/accountActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TransactionRow from './TransactionRow';
import './TransactionList.css';
import NewTransactionRow from './NewTransactionRow';

class TransactionList extends Component {
  displayName = TransactionList.name;
  constructor(props) {
    super(props);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.saveTransaction = this.saveTransaction.bind(this);
    this.state = {
    }
  }
  
  deleteTransaction(transactionId) {
      this.props.actions.deleteTransaction(transactionId);
  }

  saveTransaction(trx, transactionType) {
    this.props.actions.saveTransaction(trx, transactionType);
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
          account={this.props.account} />
        {this.props.transactions ? this.props.transactions.map(trx => 
        <TransactionRow key={trx.transactionId} transaction={trx} 
          onDelete={() => this.deleteTransaction(trx.transactionId)} />
        ) : <tr/>}
      </tbody>
    </table>);
  }
}

function mapStateToProps(state) {
  return {
    categories: state.categoryState.categories,
    accounts: state.accountState.accounts
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(accountActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionList);