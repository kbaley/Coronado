import React, { Component } from 'react';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DeleteIcon } from './icons/DeleteIcon';
import './DeleteAccount.css';

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
        <DeleteIcon onDelete={this.deleteAccount} className="delete-account"/>
      </span>
    );
  }
}

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(DeleteAccount);