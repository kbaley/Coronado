import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export class DeleteAccount extends Component {
  displayName = DeleteAccount.name

  constructor(props) {
    super(props);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.state = { };
  }

  deleteAccount() {
    console.log("ID: " + this.props.accountId);
    fetch('/api/Accounts/' + this.props.accountId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  render() {
    return (
      <div>
        <Button onClick={this.deleteAccount}>Delete Account</Button>
      </div>
    );
  }
}
