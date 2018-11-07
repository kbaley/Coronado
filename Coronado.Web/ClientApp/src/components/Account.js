import React, { Component } from 'react';
import DeleteAccount from './DeleteAccount';
import * as accountActions from '../actions/accountActions';
import * as transactionActions from '../actions/transactionActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TransactionList from './TransactionList';
import { find } from 'lodash';
import './Account.css';
import EditAccount from './EditAccount';
import { filter } from "lodash";

 class Account extends Component {
  displayName = Account.name;

  constructor(props) {
    super(props);
    this.state = { loading: true };
    
    this.deleteAccount = this.deleteAccount.bind(this);
    this.updateAccount = this.updateAccount.bind(this);
  }

  componentDidMount() {
    this.props.actions.loadTransactions(this.props.match.params.accountId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loading) {
      this.props.actions.loadTransactions(this.props.match.params.accountId);
      this.setState({loading:false});
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Reload if the account ID changes
    if (nextProps.match.params.accountId !== prevState.prevAccountId) {
      return {
        prevAccountId: nextProps.match.params.accountId,
        loading: true
      }
    }
    return null;
  }
  
  deleteAccount() {
    var account = this.getSelectedAccount();
    this.props.actions.deleteAccount(account.accountId, account.name);
  }
  
  updateAccount(account) {
    this.props.actions.updateAccount(account);
  }

  getSelectedAccount() {
    if (!this.props.accounts) return { name: '', transactions: []}
    const account = find(this.props.accounts, (a) => { return a.accountId === this.props.match.params.accountId });
    if (!account) return { name: '', transactions: []}
    return account;
  }

  getMortgageAccounts() {
    return filter(this.props.accounts, a => a.accountType === "Mortgage");
  }

  render() {
    var account = this.getSelectedAccount();
    return (
      <div>
        <div style={{float: "right", width: "100px"}}>
          <EditAccount account={account} onUpdate={this.updateAccount} accountTypes={this.props.accountTypes} />
          <DeleteAccount onDelete={this.deleteAccount} />
        </div>
        <AccountHeader account={account} />
        <TransactionList 
          transactions={this.props.transactions} 
          mortgageAccounts={this.getMortgageAccounts()}
          account={account}
          categories={this.props.categories}
        />
      </div>
    );
  }
}

function AccountHeader(props) {
  return <h1>
    {props.account ? props.account.name : ""} 
    </h1>
}

function mapStateToProps(state) {
   return {
     accounts: state.accountState.accounts,
     accountTypes: state.accountTypes,
     transactions: state.transactions
   }
}

function mapDispatchToProps(dispatch) {
   return {
     actions: bindActionCreators({...accountActions, ...transactionActions}, dispatch)
   }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
