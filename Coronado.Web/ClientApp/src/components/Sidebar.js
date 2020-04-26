import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AccountNavList from './AccountNavList';
import CategoriesMenu from './categories/CategoriesMenu';
import InvoicesMenu from './invoices/InvoicesMenu';
import CustomersMenu from './customers/CustomersMenu';
import InvestmentsMenu from './investments_page/InvestmentsMenu';
import ReportsMenu from './reports_page/ReportsMenu';
import NewAccount from './account_page/NewAccount';
import ToggleAllAccounts from './account_page/ToggleAllAccounts';
import { makeStyles, Drawer, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import NetWorth from './NetWorth';

const drawerWidth = 335;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  }
}));

export default Sidebar => {
  const classes = useStyles();
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
      <div className="sidebar-heading">
        <Link to={'/'}>Coronado</Link>
        <NetWorth />
      </div>
      <Divider />
      <AccountNavList />
      <Divider />
      <InvoicesMenu />
      <ReportsMenu />
      <CategoriesMenu />
      <InvestmentsMenu />
      <CustomersMenu />
    </Drawer>
  </div>
  );
};
