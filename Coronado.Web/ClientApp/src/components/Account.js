import React, { Component } from 'react';
import DeleteAccount from './DeleteAccount';
import { actionCreators } from '../store/Account';
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
  }

  componentDidMount() {
    this.props.requestTransactions(this.props.match.params.accountId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loading) {
      this.props.requestTransactions(this.props.match.params.accountId);
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
        {this.props.isAccountLoading ? <p><em>Loading...</em></p> : (
          <div>
            <div style={{float: "right", width: "100px"}}>
              <EditAccount account={account} />
              <DeleteAccount accountId={account.accountId} accountName={account.name} />
            </div>
            <AccountHeader account={account} />
            <TransactionList 
              transactions={account.transactions} 
              mortgageAccounts={this.getMortgageAccounts()}
              account={account}
              categories={this.props.categories}
            />
          </div>
        )}
      </div>
    );
  }
}

function AccountHeader(props) {
  return <h1>
    {props.account ? props.account.name : ""} 
    </h1>
}

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Account);
