import React, { Component } from 'react';

export class FetchData extends Component {
  displayName = FetchData.name

  constructor(props) {
    super(props);
    this.state = { accounts: [], loading: true };

    fetch('api/Accounts')
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
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {account.map(account =>
            <tr key={account.accountId}>
              <td>{account.name}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderAccountsTable(this.state.accounts);

    return (
      <div>
        <h1>Accounts</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }
}
