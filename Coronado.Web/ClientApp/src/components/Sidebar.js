import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountNavList from './AccountNavList';
import NewAccount from './account_page/NewAccount';
import ToggleAllAccounts from './account_page/ToggleAllAccounts';
import { Drawer, Divider, withStyles, List, CssBaseline } from '@material-ui/core';
import { Link } from 'react-router-dom';
import NetWorth from './NetWorth';
import { SidebarMenuItem } from './common/SidebarMenuItem';
import './Sidebar.css';
import styles from '../assets/jss/material-dashboard-react/components/sidebarStyle.js';
import routes from '../routes';
import { getInvestmentsTotal } from './common/investmentHelpers';
import { MoneyFormat } from './common/DecimalFormat';
import { connect } from 'react-redux';
import { sumBy } from 'lodash';

export class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.activeRoute = this.activeRoute.bind(this);
  }

  activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1;
  }
  render() {
    const { classes } = this.props;

  return (localStorage.getItem('coronado-user') &&
  <div>
    <CssBaseline />
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.sidebarWrapper}>
      <div className={classes.logo}>
        <Link to={'/'} className={classes.logoLink}>Coronado</Link>
        <NetWorth />
      </div>
      <div>Accounts <NewAccount /><ToggleAllAccounts /></div>
      <List className={classes.list}>
      <AccountNavList />
      </List>
      <Divider light={true} />
      <List className={classes.list}>
        { routes.map((route, index) => {
          let secondary = null;
          if (route.name === 'Investments') {
            secondary = <MoneyFormat amount={getInvestmentsTotal()} />;
          }
          if (route.name === 'Invoices') {
            secondary = <MoneyFormat amount={sumBy(this.props.invoices, i => { return i.balance })} />;
          }
          if (route.isTopLevelMenu)
            return <SidebarMenuItem key={index} to={route.path} primary={route.name} icon={route.icon} secondary={secondary} />
          else
            return null;
        })}
      </List>
      </div>
      <div
        className={classes.background}
      />
    </Drawer>
  </div>
  );
};
}

function mapStateToProps(state) {
  return {
    investments: state.investments,
    invoices: state.invoices,
  }
}

export default connect(
  mapStateToProps,
  null)
  (withStyles(styles)(Sidebar));

Sidebar.propTypes = {
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  image: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};
