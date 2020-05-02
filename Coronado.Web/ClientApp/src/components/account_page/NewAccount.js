import React, { Component } from 'react';
import * as accountActions from '../../actions/accountActions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { AccountForm } from './AccountForm';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Button, withStyles } from '@material-ui/core';
import styles from '../../assets/jss/material-dashboard-react/components/sidebarStyle.js';

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
    const { classes } = this.props;
    return (
      <div className={classes.newAccount}>
        <Button onClick={this.newAccount} className={classes.green} size="small">
          <AddCircleIcon />
          <span style={{"marginLeft": "5px"}}>New Account</span>
        </Button>
        <AccountForm show={this.state.show} onClose={this.handleClose}
          onSave={this.saveNewAccount} accountTypes={this.props.accountTypes} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accountTypes: state.accountTypes
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
)(withStyles(styles)(NewAccount));