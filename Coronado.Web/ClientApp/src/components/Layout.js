import React from 'react';
import './Layout.css';
import NotificationsComponent from './Notifications';
import { ShortcutHelper } from './common/ShortcutHelper';
import { Icon } from "./icons/Icon";
import Sidebar from './Sidebar';
import { makeStyles } from '@material-ui/core/styles';

import styles from '../assets/jss/material-dashboard-react/layouts/adminStyle.js';

const useStyles = makeStyles(styles);

export default function Layout(props) {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Sidebar />
      <div className={classes.mainPanel}>
        <div style={{textAlign: "right", marginTop: 4}}>
          <Icon glyph="sign-out-alt" onClick={() => { localStorage.removeItem('coronado-user'); window.location.reload(true);}} />
        </div>
        <div className={classes.content}>
          <div className={classes.container}>
            {props.children}
          </div>
        </div>
      </div>
      <NotificationsComponent />
      <ShortcutHelper />
    </div>
  );
};
