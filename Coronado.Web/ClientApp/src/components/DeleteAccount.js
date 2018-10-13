import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class DeleteAccount extends Component {
  displayName = DeleteAccount.name

  constructor(props) {
    super(props);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.state = { };
  }

  deleteAccount() {
    this.props.deleteAccount(this.props.accountId, this.props.accountName);
  }

  render() {
    return (
      <div>
        <Button onClick={this.deleteAccount}>Delete Account</Button>
      </div>
    );
  }
}

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(DeleteAccount);