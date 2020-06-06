import React, { Component } from 'react';
import * as accountActions from '../../actions/accountActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';
import { MoneyFormat } from '../common/DecimalFormat';
import Spinner from '../common/Spinner';
import { filter } from 'lodash';
import { SidebarMenuItem } from './SidebarMenuItem';
import NewAccount from '../account_page/NewAccount';
import ToggleAllAccounts from './ToggleAllAccounts';
import { Toolbar, withStyles, List } from '@material-ui/core';
import getIcon from './AccountNavListIcons';

const styles = theme => ({

});

class AccountNavList extends Component {
  displayName = AccountNavList.name;

  constructor(props) {
    super(props);
    this.goToAccount = this.goToAccount.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.state = { 
      isLoading: true, 
      accounts: props.accounts,
    };
  }

  componentDidUpdate() {

    if (this.state.isLoading && this.props.accounts && this.props.accounts.length > 0) {
      for (var i = 0; i < this.props.accounts.length; i++) {
        if (i < 10) {
          Mousetrap.bind('g ' + (i + 1), this.goToAccount);
        }
      }
      this.setState({
        isLoading: false,
        accounts: this.props.accounts,
      });
    }
  }

  componentWillUnmount() {
    for (var i = 0; i < 10; i++) {
      Mousetrap.unbind('g ' + (i + 1));
    }
  }

  goToAccount(e) {
    var key = parseInt(e.key, 10) - 1;
    this.props.history.push('/account/' + this.props.accounts[key].accountId);
  }

  getBalance(account) {
    return account.currentBalanceInUsd;
  }

  render() {
    const { classes } = this.props;
    const { history } = this.props;
    const pathname = history.location.pathname;
    return (
      <List className={classes.list}>
        <Toolbar disableGutters={true} className={classes.toolbar} >
          <NewAccount />
          <ToggleAllAccounts />
        </Toolbar>
        {this.props.isLoadingData ? <Spinner /> :
          this.props.accounts.map((account, index) => (
              <SidebarMenuItem
              key={index}
              to={'/account/' + account.accountId}
              selected={'/account/' + account.accountId === pathname}
              primary={account.name}
              secondary={<MoneyFormat amount={this.getBalance(account)} />}
              icon={getIcon(account.accountType)} />
          ))}
      </List>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.showAllAccounts ? state.accounts : filter(state.accounts, a => !a.isHidden),
    isLoadingData: state.loading ? state.loading.accounts : true,
    showAllAccounts: state.showAllAccounts,
    currencies: state.currencies,
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
  { pure: false }
)(withStyles(styles)(AccountNavList)));