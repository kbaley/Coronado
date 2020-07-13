import React from 'react';
import AccountNavList from './AccountNavList';
import { Drawer, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';

const drawerWidth = 350;
const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    backgroundColor: theme.palette.blue,
  },
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  return (localStorage.getItem('coronado-user') &&
        <Hidden smDown>
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
        </Hidden>
  );
};

Sidebar.propTypes = {
};
