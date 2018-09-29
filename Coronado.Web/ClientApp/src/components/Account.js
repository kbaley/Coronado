import React, { Component } from 'react';
import DeleteAccount from './DeleteAccount';

export class Account extends Component {
  displayName = Account.name;

  constructor(props) {
    super(props);
    this.state = { loadingTransactions: true, loadingAccountData: true };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loadingAccountData || this.state.loadingTransactions) {
      this.loadData();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.accountId !== prevState.prevAccountId) {
      return {
        prevAccountId: nextProps.match.params.accountId,
        loadingAccountData: true,
        loadingTransactions: true
      }
    }
    return null;
  }

  loadData() {
    fetch('api/Transactions/?accountId=' + this.props.match.params.accountId)
      .then(response => response.json())
      .then(data => {
        this.setState({ transactions: data, loadingTransactions: false });
      });

    fetch('api/Accounts/' + this.props.match.params.accountId)
      .then(response => response.json())
      .then(data => {
        this.setState({ accountData: data, accountName: data.name, loadingAccountData: false });
      })
  }

  static renderTransactions(transactions) {
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
          {transactions.map(trx =>
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

  render() {
    let transactions = this.state.loadingTransactions
      ? <p><em>Loading...</em></p>
      : Account.renderTransactions(this.state.transactions);

    return (
      <div>
        <AccountHeader name={this.state.accountName} />
        {transactions}
        <DeleteAccount accountId={this.props.match.params.accountId} />
      </div>
    );
  }
}

function AccountHeader(props) {
  return <h1>{props.name}</h1>
}

