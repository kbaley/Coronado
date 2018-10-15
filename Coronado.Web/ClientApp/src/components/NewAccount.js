import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { actionCreators } from '../store/Account';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { AccountForm } from './AccountForm';

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
    this.props.saveNewAccount(account);
  }

  render() {
    return (
      <div>
        <Nav>
          <NavItem>
            <Button onClick={this.newAccount}>New Account</Button>
          </NavItem>
        </Nav>
        <AccountForm show={this.state.show} handleClose={this.handleClose}
          onSave={this.saveNewAccount} />
      </div>
    );
  }
}

export default connect(
  state => state.account,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(NewAccount);