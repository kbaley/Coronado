import React from 'react';
import './Layout.css';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import styles from '../assets/jss/material-dashboard-react/components/headerStyle.js';

const useStyles = makeStyles(styles);

export default function Header(props) {
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}></div>
        <div>
          <IconButton 
            className={classes.buttonLink}
            onClick={() => { localStorage.removeItem('coronado-user'); window.location.reload(true);}}>
            <ExitToAppIcon className={classes.icons} />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};
