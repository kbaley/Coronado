import React, { Component } from 'react';
import * as transactionActions from '../../actions/transactionActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TransactionRow from './TransactionRow';
import './TransactionList.css';
import NewTransactionRow from './NewTransactionRow';
import { Table, TableHead, TableRow, TableBody, TableCell, withStyles } from '@material-ui/core';

const styles = theme => ({
  transactionTable: {
    width: "100%",
    "& td": {
      padding: "0px",
    },
    "& td:nth-child(1)": {
      width: 120,
      maxWidth: 120,
    },
    "& td:nth-child(2)": {
      width: 110,
      maxWidth: 110,
    },
    "& td:nth-child(3)": {
      maxWidth: 130,
    },
    "& td:nth-child(4)": {
      maxWidth: 180,
    },
    "& td:nth-child(5)": {
    },
    "& td:nth-child(6), & td:nth-child(7), & td:nth-child(8)": {
      width: 100,
      maxWidth: 100,
    },
    "& input": {
      width: "100%",
    }
  }
})

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
    const { classes } = this.props;
    return (
      <Table className={classes.transactionTable}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Debit</TableCell>
            <TableCell>Credit</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <NewTransactionRow
            account={this.props.account} />
          {this.props.transactions ? this.props.transactions.map(trx =>
            <TransactionRow key={trx.transactionId} transaction={trx}
              onDelete={() => this.deleteTransaction(trx.transactionId)} />
          ) : <tr />}
        </TableBody>
      </Table>
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
)(withStyles(styles)(TransactionList));