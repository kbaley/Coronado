import React, { Component } from 'react';
import { CheckIcon } from '../icons/CheckIcon';
import * as Mousetrap from 'mousetrap';
import { CategorySelect } from '../common/CategorySelect';
import { find } from 'lodash';
import { bindActionCreators } from 'redux';
import * as transactionActions from '../../actions/transactionActions';
import { connect } from 'react-redux';
import { getCategoriesForDropdown } from "../../selectors/selectors";
import VendorField from '../common/VendorField';
import { withStyles, TableRow, TableCell } from '@material-ui/core';

const styles = theme => ({
  input: {
    height: 27,
    fontSize: 14,
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  }
});

export class NewTransactionRow extends Component {
  constructor(props) {
    super(props);
    this.saveTransaction = this.saveTransaction.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeDebit = this.handleChangeDebit.bind(this);
    this.handleChangeVendor = this.handleChangeVendor.bind(this);
    this.setFocus = this.setFocus.bind(this);

    this.state = {
      trx: {
        transactionDate: new Date().toLocaleDateString(),
        vendor: '',
        description: '',
        accountId: props.account.accountId,
        credit: '',
        debit: '',
        invoiceId: '',
        transactionType: 'REGULAR',
      },
      selectedCategory: {},
      categories: [],
      transactionType: "REGULAR",
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
    if (e) e.preventDefault();
    this.refs["inputDate"].focus();
    return false;
  }

  handleChangeField(e) {
    const name = e.target.name;
    this.setState({ trx: { ...this.state.trx, [name]: e.target.value } });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.saveTransaction();
    }
  }

  handleChangeVendor(vendorName) {
    let categoryId = this.state.trx.categoryId;
    let categoryDisplay = this.state.trx.categoryDisplay;
    let selectedCategory = this.state.selectedCategory;
    const vendor = this.props.vendors.find(v => v.name === vendorName);
    if (vendor) {
      const category = this.props.categories.find(c => c.categoryId === vendor.lastTransactionCategoryId);
      if (category) {
        categoryId = category.categoryId;
        categoryDisplay = category.name;
        selectedCategory = category;
      }
    }
    this.setState({ 
      trx: {
        ...this.state.trx, 
        vendor: vendorName,
        categoryId,
        categoryDisplay
      },
      selectedCategory
    });
  }

  handleChangeDebit(e) {
    let credit = '';
    const debit = e.target.value;
    if (this.state.transactionType === "MORTGAGE_PAYMENT" && this.state.mortgageType === 'fixedPayment' && debit !== '') {
      credit = this.state.mortgagePayment - Number(debit);
    }
    this.setState({ trx: { ...this.state.trx, debit, credit } });
  }

  handleChangeCategory(selectedCategory) {
    if (selectedCategory === null) {
      // Category cleared
      this.setState({
        trx: { ...this.state.trx, categoryId: '', categoryDisplay: '' }, selectedCategory: {}
      });
      return;
    }
    if (selectedCategory.id) {
      // New category
      this.setState({
        trx: { ...this.state.trx, categoryId: '', categoryDisplay: selectedCategory.name, categoryName: selectedCategory.name }, selectedCategory
      });
      return;
    }
    let categoryId = selectedCategory.categoryId;
    let transactionType = "REGULAR";
    let mortgageType = '';
    let mortgagePayment = '';
    let invoiceId = '';
    let categoryDisplay = selectedCategory.name;
    let debit = this.state.trx.debit;
    let credit = this.state.trx.credit;
    let relatedAccountId = '';
    if (categoryId.substring(0, 4) === "TRF:") {
      transactionType = "TRANSFER";
      relatedAccountId = categoryId.substring(4);
      categoryId = '';
    }
    if (categoryId.substring(0, 4) === "MRG:") {
      transactionType = "MORTGAGE_PAYMENT";
      relatedAccountId = categoryId.substring(4);
      const relatedAccount = find(this.props.accounts, a => a.accountId === relatedAccountId);
      categoryId = '';
      debit = relatedAccount.mortgagePayment || '';
      mortgageType = relatedAccount.mortgageType;
      mortgagePayment = relatedAccount.mortgagePayment;
    }
    if (categoryId.substring(0, 4) === "PMT:") {
      transactionType = "INVOICE";

      invoiceId = selectedCategory.invoiceId;
      categoryId = '';
      credit = selectedCategory.balance;
    }
    this.setState({
      trx: { ...this.state.trx, categoryId, debit, credit, categoryDisplay, invoiceId, relatedAccountId, transactionType },
      transactionType,
      mortgageType,
      mortgagePayment,
      selectedCategory
    });
  }

  saveTransaction() {
    this.props.actions.createTransaction(this.state.trx);

    this.setState(
      {
        trx:
        {
          ...this.state.trx,
          vendor: '',
          description: '',
          debit: '',
          credit: '',
          invoiceId: '',
          categoryId: '',
          categoryDisplay: '',
          relatedAccountId: ''
        },
        selectedCategory: { value: null },
        transactionType: "REGULAR",
      }
    );
    this.setFocus();
  }

  render() {
    const { classes } = this.props;
    return (
      <TableRow>
        <TableCell>
          <CheckIcon onClick={this.saveTransaction} />
        </TableCell>
        <TableCell><input type="text" name="transactionDate" ref="inputDate" className={classes.input}
          value={this.state.trx.transactionDate} onChange={this.handleChangeField} /></TableCell>
        <TableCell>
          <VendorField vendors={this.props.vendors} value={this.state.trx.vendor} onVendorChanged={this.handleChangeVendor} />
        </TableCell>
        <TableCell>
          <CategorySelect
            selectedCategory={this.state.selectedCategory}
            onCategoryChanged={this.handleChangeCategory}
            selectedAccount={this.state.trx.accountId}
            categories={this.props.categories} />
        </TableCell>
        <TableCell>
          <input 
            type="text" 
            name="description" 
            className={classes.input}
            value={this.state.trx.description} 
            onChange={this.handleChangeField} 
          />
        </TableCell>
        <TableCell>
          <input 
            type="text" 
            name="debit" 
            className={classes.input}
            value={this.state.trx.debit}
            onChange={this.handleChangeDebit} 
            onKeyPress={this.handleKeyPress} 
          />
        </TableCell>
        <TableCell>
          <input 
            type="text" 
            name="credit" 
            className={classes.input}
            value={this.state.trx.credit}
            onChange={this.handleChangeField} 
            onKeyPress={this.handleKeyPress} 
          />
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    )
  }
}

function mapStateToProps(state) {
  return {
    categories: getCategoriesForDropdown(state.categories, state.accounts, state.invoices),
    accounts: state.accounts,
    vendors: state.vendors
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(transactionActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NewTransactionRow));