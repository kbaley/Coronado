import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { ListItemText, Icon, ListItem, ListItemSecondaryAction, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const styles = theme => ({
  itemLink: {
    width: "auto",
    transition: "all 300ms linear",
    margin: "5px 15px 0",
    borderRadius: "3px",
    position: "relative",
    display: "block",
    padding: "0px 15px",
    backgroundColor: "transparent",
  },
  item: {
    position: "relative",
    display: "block",
    textDecoration: "none",
    "&:hover,&:focus,&:visited,&": {
      color: theme.palette.white
    },
  },
  itemIcon: {
    width: "24px",
    height: "30px",
    fontSize: "24px",
    lineHeight: "30px",
    float: "left",
    marginRight: "15px",
    textAlign: "center",
    verticalAlign: "middle",
    color: "rgba(255, 255, 255, 0.8)"
  },
  itemText: {
    margin: "0",
    lineHeight: "30px",
    fontSize: "15px",
    color: theme.palette.white
  },
});

const useStyles = makeStyles(styles);

export function SidebarMenuItem(props) {
  const { icon, primary, to, secondary, selected, onItemSelected } = props;
  const classes = useStyles();

  const itemSelected = () => {
    if (onItemSelected) onItemSelected();
  }

  return (
    <NavLink
      to={to}
      className={classes.item}
    >
      <ListItem
        button
        selected={selected}
        className={classes.itemLink}
        onClick={itemSelected}
      >
        {typeof icon === "string" ? (
          <Icon className={classes.itemIcon}>{icon}</Icon>
        ) : (
            React.createElement(icon, {
              className: classes.itemIcon
            })
          )}
        <ListItemText primary={primary} className={classes.itemText} disableTypography={true} />
        <Hidden mdDown>
          <ListItemSecondaryAction className={classes.itemText}>{secondary}</ListItemSecondaryAction>
        </Hidden>
      </ListItem>
    </NavLink>
  )
}

SidebarMenuItem.propTypes = {
  icon: PropTypes.object,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  secondary: PropTypes.element
}