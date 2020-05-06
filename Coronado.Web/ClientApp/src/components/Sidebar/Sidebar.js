import React from 'react';
import PropTypes from 'prop-types';
import AccountNavList from './AccountNavList';
import { Drawer, List } from '@material-ui/core';
import { makeStyles} from '@material-ui/core/styles';
import Header from './Header';

const drawerWidth = 350;
const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
  },
  root: {
    backgroundColor: theme.palette.gray[2],
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  return (localStorage.getItem('coronado-user') &&
    <Drawer
      variant="permanent"
      classes={{ paper: classes.drawer }}
      anchor="left"
    >
      <div className={classes.root}>
      <Header />
      <AccountNavList />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
};
