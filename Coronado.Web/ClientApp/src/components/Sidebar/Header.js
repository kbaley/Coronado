import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import NetWorth from './NetWorth';
import { List, ListItem, ListItemText } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  logo: {
    padding: "5px 0",
    marginLeft: 20,
  },
  item: {
    display: "block",
    "&:hover,&:focus,&:visited,&": {
      color: theme.palette.white,
      textDecoration: "none",
    }
  },
  itemLink: {
    width: "auto",
    padding: "0px 15px",
  },
  logoLink: {
    textTransform: "uppercase",
    padding: "5px 0",
    display: "block",
    fontSize: "18px",
    textAlign: "left",
    fontWeight: "400",
    lineHeight: "30px",
    textDecoration: "none",
    backgroundColor: "transparent",
    "&,&:hover": {
      color: theme.palette.white
    }
  },
}));

export default function Header(props) {
  const classes = useStyles();
  return (
    <NavLink to={'/'} className={classNames(classes.logo, classes.item)}>
      <List className={classes.list}>
        <ListItem className={classNames(classes.logoLink, classes.itemLink)}>
          <ListItemText primary="Coronado" disableTypography={true} />
          <NetWorth />
        </ListItem>
      </List>
    </NavLink>
  );
};

Header.propTypes = {
};
