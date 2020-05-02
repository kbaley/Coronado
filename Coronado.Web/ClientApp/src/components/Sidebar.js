import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountNavList from './AccountNavList';
import { Drawer, Divider, withStyles, List, ListItem, CssBaseline, ListItemText } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import NetWorth from './NetWorth';
import { SidebarMenuItem } from './common/SidebarMenuItem';
import './Sidebar.css';
import styles from '../assets/jss/material-dashboard-react/components/sidebarStyle.js';
import routes from '../routes';
import { getInvestmentsTotal } from './common/investmentHelpers';
import { MoneyFormat } from './common/DecimalFormat';
import { connect } from 'react-redux';
import { sumBy } from 'lodash';
import classNames from 'classnames';

export class Sidebar extends Component {
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
      <NavLink to={'/'} className={classNames(classes.logo, classes.item)}>
      <List className={classes.list}>
        <ListItem className={classNames(classes.logoLink, classes.itemLink)}>
          <ListItemText primary="Coronado" disableTypography={true}/>
          <NetWorth />
        </ListItem>
        </List>
      </NavLink>
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
  routes: PropTypes.arrayOf(PropTypes.object),
};
