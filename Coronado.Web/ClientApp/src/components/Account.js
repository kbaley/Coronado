import React, { Component } from 'react';
import DeleteAccount from './DeleteAccount';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

 class Account extends Component {
  displayName = Account.name;

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.props.requestAccountData(this.props.match.params.accountId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loading) {
      this.props.requestAccountData(this.props.match.params.accountId);
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

  render() {
    return (
      <div>
        {this.props.isLoading ? <p><em>Loading...</em></p> : (
          <div>
            <AccountHeader name={this.props.account.name} />
            <TransactionList transactions={this.props.transactions} />
            <DeleteAccount accountId={this.props.match.params.accountId} />
          </div>
        )}
      </div>
    );
  }
}

function AccountHeader(props) {
  return <h1>{props.name}</h1>
}

function TransactionList(props) {
  return (
    <table className='table'>
      <thead>
        <tr>
          <th>Vendor</th>
          <th>Description</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {props.transactions.map(trx =>
          <tr key={trx.transactionId}>
            <td>{trx.vendor}</td>
            <td>{trx.description}</td>
            <td>{new Date(trx.date).toLocaleDateString()}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Account);
