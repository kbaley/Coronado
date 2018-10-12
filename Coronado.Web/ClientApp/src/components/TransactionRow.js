import React, { Component } from 'react';
import Select from 'react-select';
import { DeleteIcon } from './DeleteIcon';
import { EditIcon } from './EditIcon';
import { DecimalFormat } from './DecimalFormat';
import { Glyphicon } from 'react-bootstrap';
import { find } from 'lodash';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class TransactionRow extends Component {
  constructor(props) {
    super(props);
    this.startEditing = this.startEditing.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeDebit = this.handleChangeDebit.bind(this);
    this.handleChangeCredit = this.handleChangeCredit.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
    this.state = { isEditing: false, 
        debit: '',
        credit: '',
        selectedCategory: null,
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
        selectedCategory: find(this.props.categories, c => c.value === this.state.trx.category.categoryId)
    })
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
      this.setState( { trx: {...this.state.trx, amount: amount, credit: amount}});
    } else {
      this.handleChangeField();
    }
  }

  handleChangeCategory(selectedOption) {
    this.setState( {trx: {...this.state.trx, categoryId: selectedOption.value }});
    this.setState( { selectedCategory: selectedOption });
  }

  updateTransaction() {
    this.props.updateTransaction(this.state.trx);
    this.setState(...this.state, 
      {
        selectedCategory : null,
        isEditing: false
      });

  }

  render() {
    const trx = this.props.transaction;
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

    return (
      this.state.isEditing ? 
      <tr>
        <td>
        <Glyphicon glyph="ok" style={{color: "green", cursor: "pointer"}} onClick={this.updateTransaction} />
        </td>
        <td>
        <input type="text" name="transactionDate" 
          onChange={this.handleChangeField}
          value={this.state.trx.transactionDate} />
        </td>
        <td>
            <input type="text" name="vendor" onChange={this.handleChangeField}
                value={this.state.trx.vendor} />
        </td>
        <td>
            <Select value={this.state.selectedCategory} onChange={this.handleChangeCategory}
              options={this.props.categories} styles={customStyles}  />
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

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TransactionRow);