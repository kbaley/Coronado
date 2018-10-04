import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
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
    // console.log(this.props);
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
        {this.props.transactionList ? this.props.transactionList.map(trx => <tr key={trx.transactionId}>
          <td>{trx.vendor}</td>
          <td>{trx.categoryName}</td>
          <td>{trx.description}</td>
          <td>{new Date(trx.transactionDate).toLocaleDateString()}</td>
          <td>
            <EditTransaction transactionId={trx.transactionId} />
            <a onClick={() => this.deleteTransaction(trx.transactionId)} style={{ cursor: 'pointer', color: "#000" }}>
              <Glyphicon glyph='remove-circle' style={{ color: "#aa0000" }} />
            </a>
          </td>
        </tr>) : <tr/>}
      </tbody>
    </table>);
  }
}

export function EditTransaction(props) {
  return (
    <a onClick={console.log} style={{cursor: 'pointer', color: "#000"}}>
    <Glyphicon glyph='pencil' style={{paddingRight: "10px"}}/>
    </a>
  )
}

export default connect(
  state => state.transactionList,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TransactionList);