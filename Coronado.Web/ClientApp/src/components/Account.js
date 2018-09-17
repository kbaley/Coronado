import React, { Component } from 'react';

export class Account extends Component {
  displayName = Account.name;

  constructor(props) {
    super(props);
    this.state = { accounts: [], loading: true };

    fetch('api/Transactions/?accountId=' + props.match.params.accountId)
      .then(response => response.json())
      .then(data => {
        this.setState({ accounts: data, loading: false });
      });
  }

  static renderAccountsTable(accounts) {
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
          {accounts.map(account =>
            <tr key={account.accountId}>
              <td>{account.vendor}</td>
              <td>{account.description}</td>
              <td>{new Date(account.date).toLocaleDateString()}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Account.renderAccountsTable(this.state.accounts);

    return (
      <div>
        <h1>Accounts</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }
}
