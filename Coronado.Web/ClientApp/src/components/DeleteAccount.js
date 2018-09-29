import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { actionCreators } from '../store/AccountNavList';
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
    this.props.deleteAccount(this.props.accountId);
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
  state => state.accountNavList,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(DeleteAccount);