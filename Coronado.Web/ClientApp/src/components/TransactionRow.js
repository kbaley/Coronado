import React, { Component } from 'react';
import { DeleteIcon } from './DeleteIcon';
import { EditIcon } from './EditIcon';
import { DecimalFormat } from './DecimalFormat';
import { Glyphicon } from 'react-bootstrap';

export class TransactionRow extends Component {
  constructor(props) {
    super(props);
    this.startEditing = this.startEditing.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeDebit = this.handleChangeDebit.bind(this);
    this.handleChangeCredit = this.handleChangeCredit.bind(this);
    this.state = { isEditing: false, 
        debit: '',
        credit: '',
        trx: {...props.transaction, 
            date: new Date(props.transaction.date).toLocaleDateString(),
            credit: props.transaction.amount > 0 ? props.transaction.amount.toFixed(2) : '',
            debit: props.transaction.amount <= 0 ? (0 - props.transaction.amount).toFixed(2) : '',
            categoryName: props.transaction.category.name } };
  }

  startEditing() {
    const amount = this.state.trx.amount;
    const debit = amount <= 0 ? (0 - amount).toFixed(2) : '';
    const credit = amount > 0 ? amount.toFixed(2) : '';
    this.setState({
        isEditing: true,
        debit,
        credit
    })
  }

  handleChangeField(e) {
    var name = e.target.name;
    this.setState( { trx: {...this.state.trx, [name]: e.target.value } } );
  }

  handleChangeDebit(e) {
    if (e.targetValue !== '') {
      var amount = 0 - parseFloat(e.target.value);
      this.setState( { trx: {...this.state.trx, amount: amount}});
    }
    this.handleChangeField(e);
  }

  handleChangeCredit(e) {
    if (e.targetValue !== '') {
      var amount = parseFloat(e.target.value);
      this.setState( { trx: {...this.state.trx, amount: amount}});
    }
    this.handleChangeField(e);
  }

  render() {
    const trx = this.state.trx;
    return (
      this.state.isEditing ? 
      <tr>
        <td>
        <Glyphicon glyph="ok" style={{color: "green", cursor: "pointer"}} onClick={console.log} />
        </td>
        <td>
        <input type="text" name="date" 
          onChange={this.handleChangeField}
          value={this.state.trx.date} />
        </td>
        <td>
            <input type="text" name="vendor" onChange={this.handleChangeField}
                value={this.state.trx.vendor} />
        </td>
        <td>
            <input type="text" name="categoryName" onChange={this.handleChangeField}
                value={this.state.trx.categoryName} />
        </td>
        <td>
            <input type="text" name="description" onChange={this.handleChangeField}
                value={this.state.trx.description} />
        </td>
        <td>
          <input type="text" name="debit" value={this.state.trx.debit} 
            onChange={this.handleChangeDebit} /></td>
        <td>
          <input type="text" name="credit" value={this.state.trx.credit} 
            onChange={this.handleChangeCredit} /></td>
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
        <td><DecimalFormat isDebit={true} amount={trx.amount} /></td>
        <td><DecimalFormat isCredit={true} amount={trx.amount} /></td>
        <td>{Number(trx.runningTotal).toFixed(2)}</td>
      </tr>
    );
  }
}