import React, { Component } from 'react';
import { AccountForm } from './AccountForm';
import { EditIcon } from './icons/EditIcon';
import './EditAccount.css';

class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.state = { show: false };
  }
  showForm() {
    this.setState({ show: true });
  }
  hideForm() {
    this.setState({ show: false });
  }
  render() {
    return (<span>
      <EditIcon className="edit-account" onStartEditing={this.showForm} />
      <AccountForm 
        show={this.state.show} 
        onClose={this.hideForm} 
        account={this.props.account} 
        onSave={this.props.onUpdate}
        accountTypes={this.props.accountTypes}
      />
    </span>);
  }
}

export default EditAccount;