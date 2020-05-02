import React from 'react';
import './Layout.css';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from '@material-ui/icons/Settings';
import routes from '../routes';

import styles from '../assets/jss/material-dashboard-react/components/headerStyle.js';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(styles);

export default function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const logout = () => {
    localStorage.removeItem('coronado-user'); 
    window.location.reload(true);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}></div>
        <div>
          <IconButton variant="contained" onClick={openMenu}>
            <SettingsIcon />
          </IconButton>
          <Menu
            id="settings-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {routes.map((route, index) => {
              if (route.isTopLevelMenu) {
                return (
              <MenuItem key={index} component={Link} to={route.path} onClick={handleClose}>
                <ListItemIcon>
                  {React.createElement(route.icon)}
                </ListItemIcon>
                <ListItemText primary={route.name} />
              </MenuItem>
              )} else {
                return null;
              };
            })}
            <MenuItem onClick={logout}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Log out" />
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};
