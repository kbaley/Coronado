import React, { Component } from 'react';
import * as accountActions from '../actions/accountActions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { AccountForm } from './AccountForm';
import { NewIcon } from './icons/NewIcon';

class NewAccount extends Component {
  displayName = NewAccount.name

  constructor(props) {
    super(props);
    this.newAccount = this.newAccount.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.saveNewAccount = this.saveNewAccount.bind(this);
    this.state = { show: false };
  }

  componentDidMount() {
    Mousetrap.bind('n a', this.newAccount);
  }

  componentWillUnmount() {
    Mousetrap.unbind('n a');
  }

  newAccount() {
    this.setState({ show: true });
    return false;
  }

  handleClose() {
    this.setState({ show: false });
  }

  saveNewAccount(account) {
    this.props.actions.createAccount(account);
  }

  render() {
    return (
      <span>
        <NewIcon onClick={this.newAccount} />
        <AccountForm show={this.state.show} onClose={this.handleClose}
          onSave={this.saveNewAccount} accountTypes={this.props.accountTypes} />
      </span>
    );
  }
}

function mapStateToProps(state) {
  return {
    accountTypes: state.accountState.accountTypes
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(accountActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewAccount);