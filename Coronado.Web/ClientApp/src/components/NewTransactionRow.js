import React, { Component } from 'react';
import { CheckIcon } from './icons/CheckIcon';
import * as Mousetrap from 'mousetrap';
import { CategorySelect } from './common/CategorySelect';
import { find } from 'lodash';
import { bindActionCreators } from 'redux';
import * as transactionActions from '../actions/transactionActions';
import { connect } from 'react-redux';
import { getCategoriesForDropdown } from "../selectors/selectors";

export class NewTransactionRow extends Component {
  constructor(props) {
    super(props);
    this.saveTransaction = this.saveTransaction.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this); 
    this.handleChangeDebit = this.handleChangeDebit.bind(this);
    this.setFocus = this.setFocus.bind(this);

    this.state = {
      trx: {
        transactionDate: new Date().toLocaleDateString(), 
        vendor: '', 
        description: '',
        accountId: props.account.accountId,
        credit: '',
        debit: ''
      },
      selectedCategory: {},
      categories: [],
      transactionType: "Transaction",
      mortgageType: '',
      mortgagePayment: ''
    }
  }

  componentDidMount() {
      Mousetrap.bind('n t', this.setFocus);
  }

  componentWillUnmount() {
    Mousetrap.unbind('n t');
  }

  componentDidUpdate() {
    if (this.props.account && this.props.account.accountId !== this.state.trx.accountId) {
      this.setState({
        trx: {
          ...this.state.trx,
          accountId: this.props.account.accountId
        }
      })
    }
  }
  

  setFocus(e) {
    e.preventDefault();
    this.refs["inputDate"].focus();
    return false;
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
    var credit = '';
    var debit = e.target.value;
    if (this.state.transactionType === "Mortgage" && this.state.mortgageType === 'fixedPayment' && debit !== '') {
      credit = this.state.mortgagePayment - Number(debit);
    } 
    this.setState({trx: { ...this.state.trx, debit, credit}});
  }

  handleChangeCategory(selectedCategory) {
    console.log("Changing category");
    
    let categoryId = selectedCategory.categoryId;
    var transactionType = "Transaction";
    var relatedAccountId = '';
    var mortgageType = '';
    var mortgagePayment = '';
    var categoryDisplay = selectedCategory.name;
    var debit = this.state.trx.debit;
    if (categoryId.substring(0,4) === "TRF:") {
      transactionType = "Transfer";
      relatedAccountId = categoryId.substring(4);
      categoryId = '';
    }
    if (categoryId.substring(0,4) === "MRG:") {
      transactionType = "Mortgage";
      relatedAccountId = categoryId.substring(4);
      var relatedAccount = find(this.props.accounts, a => a.accountId === relatedAccountId);
      categoryId = '';
      debit = relatedAccount.mortgagePayment || '';
      mortgageType = relatedAccount.mortgageType;
      mortgagePayment = relatedAccount.mortgagePayment;
    }
    this.setState( {
      trx: {...this.state.trx, categoryId, relatedAccountId, debit, categoryDisplay },
      transactionType,
      mortgageType,
      mortgagePayment,
      selectedCategory});
  }

  saveTransaction() {
    this.props.actions.createTransaction(this.state.trx, this.state.transactionType);
    this.setState( 
      { trx: { ...this.state.trx, vendor: '', description: '', debit: '', credit: '', relatedAccountId: '' }, 
        selectedCategory: { }
      }
    );
  }
  render() {
    return (
      <tr key="new-transaction">
        <td>
          <CheckIcon onClick={this.saveTransaction} />
        </td>
        <td><input type="text" name="transactionDate" ref="inputDate"
          value={this.state.trx.transactionDate} onChange={this.handleChangeField}/></td>
        <td><input type="text" name="vendor" value={this.state.trx.vendor} onChange={this.handleChangeField} /></td>
        <td>
          <CategorySelect 
            selectedCategory={this.state.selectedCategory}
            onCategoryChanged={this.handleChangeCategory} 
            selectedAccount={this.state.trx.accountId}
            categories={this.props.categories} />
        </td>
        <td><input type="text" name="description" value={this.state.trx.description} onChange={this.handleChangeField} /></td>
        <td><input type="text" name="debit" value={this.state.trx.debit} 
          onChange={this.handleChangeDebit} onKeyPress={this.handleKeyPress} /></td>
        <td><input type="text" name="credit" value={this.state.trx.credit} 
          onChange={this.handleChangeField} onKeyPress={this.handleKeyPress} /></td>
          <td></td>
      </tr>
    )
  }
}

function mapStateToProps(state) {
  return {
    categories: getCategoriesForDropdown(state.categories, state.accounts),
    accounts: state.accounts
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
)(NewTransactionRow);