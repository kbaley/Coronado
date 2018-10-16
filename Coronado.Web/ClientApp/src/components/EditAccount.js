import React, { Component } from 'react';
import { AccountForm } from './AccountForm';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { EditIcon } from './EditIcon';
import './EditAccount.css';

class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.saveAccount = this.saveAccount.bind(this);
    this.state = { show: false };
  }
  showForm() {
    this.setState({ show: true });
    this.props.requestAccountTypes();
  }
  hideForm() {
    this.setState({ show: false });
  }
  saveAccount(account) {
    this.props.updateAccount(account);
  }
  render() {
    return (<span>
      {/* <Glyphicon glyph="pencil" className="edit-icon" onClick={this.showForm} /> */}
      <EditIcon className="edit-account" onStartEditing={this.showForm} />
      <AccountForm 
        show={this.state.show} 
        onClose={this.hideForm} 
        account={this.props.account} 
        onSave={this.saveAccount}
        accountTypes={this.props.accountTypes}
      />
    </span>);
  }
}

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(EditAccount);