import React, { Component } from 'react';
import { DeleteIcon } from './DeleteIcon';
import { EditIcon } from './EditIcon';
import { DecimalFormat } from './DecimalFormat';
import { Glyphicon } from 'react-bootstrap';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CategorySelect } from './CategorySelect';

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
    this.state = { isEditing: false, 
        debit: '',
        credit: '',
        trx: {...props.transaction, 
            transactionDate: new Date(props.transaction.date).toLocaleDateString(),
            credit: props.transaction.amount > 0 ? props.transaction.amount.toFixed(2) : '',
            debit: props.transaction.amount <= 0 ? (0 - props.transaction.amount).toFixed(2) : '',
            categoryId: props.transaction.category.categoryId,
            categoryName: props.transaction.category.name } };
  }

  startEditing() {
    const amount = this.state.trx.amount;
    this.setState({
        isEditing: true,
        debit: amount <= 0 ? (0 - amount).toFixed(2) : '',
        credit: amount > 0 ? amount.toFixed(2) : '',
    })
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
    this.setState( {trx: {...this.state.trx, categoryId }});
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
      <tr>
        <td>
        <Glyphicon glyph="ok" style={{color: "green", cursor: "pointer"}} onClick={this.updateTransaction} />
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
            <CategorySelect selectedCategoryId={this.state.trx.category.categoryId} categories={this.props.categories}
              onCategoryChanged={this.handleChangeCategory} />
        </td>
        <td>
            <input type="text" name="description" onChange={this.handleChangeField}
                value={this.state.trx.description} onKeyPress={this.handleKeyPress} />
        </td>
        <td>
          <input type="text" name="debit" value={this.state.trx.debit} 
            onChange={this.handleChangeDebit} onKeyPress={this.handleKeyPress} /></td>
        <td>
          <input type="text" name="credit" value={this.state.trx.credit} 
            onChange={this.handleChangeCredit} onKeyPress={this.handleKeyPress} /></td>
      </tr> :

      <tr>
        <td>
            <EditIcon onStartEditing={this.startEditing} />
            <DeleteIcon onDelete={this.props.onDelete} />
        </td>
        <td>{new Date(trx.date).toLocaleDateString()}</td>
        <td>{trx.vendor}</td>
        <td>{trx.category.name}</td>
        <td>{trx.description}</td>
        <td style={{textAlign: 'right'}}><DecimalFormat isDebit={true} amount={trx.amount} /></td>
        <td style={{textAlign: 'right'}}><DecimalFormat isCredit={true} amount={trx.amount} /></td>
        <td style={{textAlign: 'right'}}>{Number(trx.runningTotal).toFixed(2)}</td>
      </tr>
    );
  }
}

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TransactionRow);