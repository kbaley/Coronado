import React, { Component } from 'react';
import * as accountActions from '../actions/accountActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';
import { MoneyFormat } from './common/DecimalFormat';
import Spinner from './common/Spinner';
import {filter} from 'lodash';
import { SidebarMenuItem } from './common/SidebarMenuItem';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import HouseIcon from '@material-ui/icons/House';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import MoneyIcon from '@material-ui/icons/Money';
import NewAccount from './account_page/NewAccount';
import ToggleAllAccounts from './account_page/ToggleAllAccounts';
import { Toolbar, withStyles } from '@material-ui/core';
import styles from '../assets/jss/material-dashboard-react/components/sidebarStyle.js';

  function getIcon(accountType) {
    switch (accountType) {
      case "Credit Card":
        return CreditCardIcon;
      case "Asset":
        return DirectionsCarIcon;
      case "Mortgage":
        return HouseIcon;
      case "Investment":
        return AttachMoneyIcon;
      case "Loan":
        return MoneyIcon;
      case "Cash":
        return AccountBalanceWalletIcon;
      default:
        return AccountBalanceIcon;
    }
  }

class AccountNavList extends Component {
  displayName = AccountNavList.name;

  constructor(props) {
    super(props);
    this.goToAccount = this.goToAccount.bind(this);
    this.state = { isLoading: true, accounts: props.accounts };
  }

  componentDidUpdate() {

    if (this.state.isLoading && this.props.accounts && this.props.accounts.length > 0) {
      for (var i = 0; i < this.props.accounts.length; i++) {
        if (i < 10) {
          Mousetrap.bind('g ' + (i+1), this.goToAccount);
        }
      }
      this.setState({
        isLoading: false,
        accounts: this.props.accounts
      });
    }
  }

  componentWillUnmount() {
    for (var i = 0; i < 10; i++) {
      Mousetrap.unbind('g ' + (i+1));
    }
  }

  goToAccount(e) {
    var key = parseInt(e.key, 10) - 1;
    this.props.history.push('/account/' + this.props.accounts[key].accountId);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
          <Toolbar disableGutters={true} className={classes.toolbar} >
            <NewAccount />
            <ToggleAllAccounts />
          </Toolbar>
        {this.props.isLoadingData ? <Spinner /> :
        this.props.accounts.map((account, index) => (
          <SidebarMenuItem 
            key={index}
            to={'/account/' + account.accountId} 
            primary={account.name} 
            secondary={<MoneyFormat amount={account.currentBalance} />}
            icon={getIcon(account.accountType)} />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.showAllAccounts ? state.accounts : filter(state.accounts, a => !a.isHidden),
    isLoadingData: state.loading ? state.loading.accounts : true,
    showAllAccounts: state.showAllAccounts
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(accountActions, dispatch)
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {pure:false}
)(withStyles(styles)(AccountNavList)));