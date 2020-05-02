import React from 'react';
import PropTypes from 'prop-types';
import AccountNavList from './AccountNavList';
import { Drawer, List, ListItem, CssBaseline, ListItemText } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import NetWorth from './NetWorth';
import './Sidebar.css';
import styles from '../assets/jss/material-dashboard-react/components/sidebarStyle.js';
import classNames from 'classnames';
import { makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
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
      </div>
      <div
        className={classes.background}
      />
    </Drawer>
  </div>
  );
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};
