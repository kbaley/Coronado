import React from 'react';
import './Layout.css';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, ListItemIcon, ListItemText, Hidden, withWidth } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from '@material-ui/icons/Settings';
import routes from '../routes';

import { Link } from 'react-router-dom';

const styles = theme => ({
  appBar: {
  },
  container: {
    paddingRight: "15px",
    minHeight: "50px"
  },
  flex: {
    flex: 1
  },
  topBarButton: {
    margin: "0 5px",
  },
  menuIcon: {
    color: theme.palette.white,
  }
});
const useStyles = makeStyles(styles);

function Header(props) {
  console.log(props);
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
    <AppBar className={classes.appBar} position="sticky" elevation={1}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}></div>
        <div>
          <Hidden mdDown>
            {routes.filter(r => r.isTopBar).map((route, index) => {
              return (<Button
                key={index}
                variant="contained"
                className={classes.topBarButton}
                color="default"
                startIcon={React.createElement(route.icon)}
                component={Link}
                to={route.path}
              >
                {route.name}
              </Button>
              )
            })}
          </Hidden>
          <IconButton variant="contained" onClick={openMenu} className={classes.menuIcon}>
            <SettingsIcon />
          </IconButton>
          <Menu
            id="settings-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
          <MenuItem onClick={handleClose}>Always Displayed</MenuItem>
        <Box clone display={{ sm: "none" }}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Box>
        <Box clone display={{ lg: "none" }}>
          <MenuItem onClick={handleClose}>My account</MenuItem>
        </Box>
        <Box clone display={{ md: "none" }}>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Box>
            <Box clone display={{ lg: "none" }}>

            <MenuItem onClick={logout}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Special out" />
            </MenuItem>
            </Box>
            {routes.filter(r => r.isTopLevelMenu).map((route, index) => {
              return (
                <MenuItem key={index} component={Link} to={route.path} onClick={handleClose}>
                  <ListItemIcon>
                    {React.createElement(route.icon)}
                  </ListItemIcon>
                  <ListItemText primary={route.name} />
                </MenuItem>
              )
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

export default withWidth()(Header);