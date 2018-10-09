import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { DeleteIcon } from './DeleteIcon';
import { actionCreators } from '../store/TransactionList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DecimalFormat } from './DecimalFormat'
import * as Mousetrap from 'mousetrap';

class TransactionList extends Component {
  displayName = TransactionList.name;
  constructor(props) {
    super(props);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.saveTransaction = this.saveTransaction.bind(this);
    this.handleChangeDebit = this.handleChangeDebit.bind(this);
    this.handleChangeCredit = this.handleChangeCredit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.state = {
      trx: {
        transactionDate: new Date().toLocaleDateString(), 
        vendor: '', 
        categoryName: '',
        description: '',
        accountId: props.accountId
      }
    }
  }


  componentDidMount() {
      this.props.setTransactionList(this.props.transactions);
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

  deleteTransaction(transactionId) {
      this.props.deleteTransaction(transactionId);
  }

  saveTransaction() {
    this.props.saveTransaction(this.state.trx);
    this.setState(...this.state, 
      {trx: {...this.state.trx, vendor: '', categoryName: '', description: '', amount: '', debit: '', credit: ''}});
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

  render() {
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
          <td><input type="text" name="categoryName" value={this.state.trx.categoryName} onChange={this.handleChangeField} /></td>
          <td><input type="text" name="description" value={this.state.trx.description} onChange={this.handleChangeField} /></td>
          <td><input type="text" name="debit" value={this.state.debit} 
            onChange={this.handleChangeDebit} onKeyPress={this.handleKeyPress} /></td>
          <td><input type="text" name="credit" value={this.state.credit} 
            onChange={this.handleChangeCredit} onKeyPress={this.handleKeyPress} /></td>
            <td></td>
        </tr>
        {this.props.transactionList ? this.props.transactionList.map(trx => 
        <TransactionRow key={trx.transactionId} transaction={trx} onDelete={() => this.deleteTransaction(trx.transactionId)}/>
        ) : <tr/>}
      </tbody>
    </table>);
  }
}

function TransactionRow(props) {
    var trx = props.transaction;
    console.log(trx);
    return <tr>
    <td>
      <a onClick={console.log} style={{cursor: 'pointer', color: "#000"}}>
      <Glyphicon glyph='pencil' style={{paddingRight: "10px"}}/>
      </a>
      <DeleteIcon onDelete={props.onDelete} />
    </td>
    <td>{new Date(trx.transactionDate).toLocaleDateString()}</td>
    <td>{trx.vendor}</td>
    <td>{trx.categoryName}</td>
    <td>{trx.description}</td>
    <td><DecimalFormat isDebit={true} amount={trx.amount} /></td>
    <td><DecimalFormat isCredit={true} amount={trx.amount} /></td>
    <td>{Number(trx.runningTotal).toFixed(2)}</td>
  </tr>
}

export default connect(
  state => state.transactionList,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TransactionList);