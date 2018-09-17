import React, { Component } from 'react';

export class Account extends Component {
  displayName = Account.name;

  constructor(props) {
    super(props);
    this.state = { transactions: [], accountData: {}, loading: true };
  }

  componentDidMount() {
    // const { accountId } = this.props.match.params;
    console.log("Account: " + this.props.match.params.accountId);

    fetch('api/Transactions/?accountId=' + this.props.match.params.accountId)
      .then(response => response.json())
      .then(data => {
        this.setState({ transactions: data, loading: false });
      });

    fetch('api/Accounts/' + this.props.match.params.accountId)
      .then(response => response.json())
      .then(data => {
        this.setState({ accountData: data});
      })
  }

  static renderAccount(accountData) {
    return (
      <h1>{accountData.name}</h1>
    );
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

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getDerivedState');
    if (nextProps.match.params.accountId != prevState.accountId) {
      const currentAccountId = nextProps.match.params.accountId;
    fetch('api/Transactions/?accountId=' + nextProps.match.params.accountId)
      .then(response => response.json())
      .then(data => {
        this.setState({ transactions: data, loading: false });
      });

    fetch('api/Accounts/' + nextProps.match.params.accountId)
      .then(response => response.json())
      .then(data => {
        this.setState({ accountData: data});
      });
      return null;
    }
  }

  render() {
    console.log('render')
    let accountData = this.state.loading
      ? <span></span>
      : Account.renderAccount(this.state.accountData);
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Account.renderTransactions(this.state.transactions);

    return (
      <div>
        {accountData}
        {contents}
      </div>
    );
  }
}
