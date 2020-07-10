import React from 'react';
import './Layout.css';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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
    <AppBar className={classes.appBar} position="sticky" elevation={1}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}></div>
        <div>
        <Hidden smDown>
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
          )})}
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
            {routes.filter(r => r.isTopBar).map((route, index) => {
                return (
        <Box key={index} clone display={{ md: "none" }}>
              <MenuItem key={index} component={Link} to={route.path} onClick={handleClose}>
                <ListItemIcon>
                  {React.createElement(route.icon)}
                </ListItemIcon>
                <ListItemText primary={route.name} />
              </MenuItem>
        </Box>
                )
            })}
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
