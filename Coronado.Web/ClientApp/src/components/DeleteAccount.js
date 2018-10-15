import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';

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
      <span>
        <Glyphicon glyph="remove-sign" className="delete-icon" onClick={this.deleteAccount} />
      </span>
    );
  }
}

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(DeleteAccount);