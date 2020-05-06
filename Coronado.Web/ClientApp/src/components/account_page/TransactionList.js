import React, { Component } from 'react';
import * as transactionActions from '../../actions/transactionActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TransactionRow from './TransactionRow';
import './TransactionList.css';
import NewTransactionRow from './NewTransactionRow';
import CustomTable from '../common/Table';

class TransactionList extends Component {
  displayName = TransactionList.name;
  constructor(props) {
    super(props);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.state = {
    }
  }
  
  deleteTransaction(transactionId) {
      this.props.actions.deleteTransaction(transactionId);
  }

  render() {
        
    return (
      <CustomTable
        tableHeader={['', 'Date', 'Vendor', 'Category', 'Description', 'Debit', 'Credit', '']}
      >
        <NewTransactionRow 
          account={this.props.account} />
        {this.props.transactions ? this.props.transactions.map(trx => 
        <TransactionRow key={trx.transactionId} transaction={trx} 
          onDelete={() => this.deleteTransaction(trx.transactionId)} />
        ) : <tr/>}
      </CustomTable>
    );
  }
}

function mapStateToProps(state) {
  return {
    categories: state.categories,
    accounts: state.accounts,
    transactions: state.transactionModel.transactions
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
)(TransactionList);