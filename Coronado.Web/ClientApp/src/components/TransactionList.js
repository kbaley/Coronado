import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { DeleteIcon } from './DeleteIcon';
import { actionCreators } from '../store/TransactionList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class TransactionList extends Component {
  displayName = TransactionList.name;
  constructor(props) {
    super(props);
    this.deleteTransaction = this.deleteTransaction.bind(this);
  }

  componentDidMount() {
      this.props.setTransactionList(this.props.transactions);
  }

  deleteTransaction(transactionId) {
      this.props.deleteTransaction(transactionId);
  }

  render() {
    return (<table className='table'>
      <thead>
        <tr>
          <th>Vendor</th>
          <th>Category</th>
          <th>Description</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {this.props.transactionList ? this.props.transactionList.map(trx => 
        <TransactionRow key={trx.transactionId} transaction={trx} onDelete={() => this.deleteTransaction(trx.transactionId)}/>
        ) : <tr/>}
      </tbody>
    </table>);
  }
}

function TransactionRow(props) {
    var trx = props.transaction;
    return <tr>
    <td>{trx.vendor}</td>
    <td>{trx.categoryName}</td>
    <td>{trx.description}</td>
    <td>{new Date(trx.transactionDate).toLocaleDateString()}</td>
    <td>
      <a onClick={console.log} style={{cursor: 'pointer', color: "#000"}}>
      <Glyphicon glyph='pencil' style={{paddingRight: "10px"}}/>
      </a>
      <DeleteIcon onDelete={props.onDelete} />
    </td>
  </tr>
}

export default connect(
  state => state.transactionList,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TransactionList);