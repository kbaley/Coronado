import React, { Component } from 'react';
import DeleteAccount from './DeleteAccount';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TransactionList from './TransactionList';
import { find } from 'lodash';
import { Glyphicon } from 'react-bootstrap';
import './Account.css';

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
      this.setState(...this.state, {loading:false});
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
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

  render() {
    return (
      <div>
        {this.props.isAccountLoading ? <p><em>Loading...</em></p> : (
          <div>
            <AccountHeader name={this.getSelectedAccount().name} />
            <TransactionList 
              transactions={this.getSelectedAccount().transactions} 
              categories={this.props.categories}
              accountId={this.props.match.params.accountId}/>
            <DeleteAccount accountId={this.props.match.params.accountId} accountName={this.getSelectedAccount().name} />
          </div>
        )}
      </div>
    );
  }
}

function AccountHeader(props) {
  return <h1>
    {props.name} <EditAccount />
    </h1>
}

class EditAccount extends Component {
  render() {
    return (
      <Glyphicon glyph="pencil" className="edit-icon" />
    );
  }
}

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Account);
