import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { ListItemText, Icon, ListItem, ListItemSecondaryAction } from '@material-ui/core';
import styles from '../../assets/jss/material-dashboard-react/components/sidebarStyle.js';
import { makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles(styles);

export function SidebarMenuItem(props) {
  const { icon, primary, to, secondary } = props;
  const classes = useStyles();

  return (
    <NavLink
      to={to}
      className={classes.item}
    >
      <ListItem button className={classes.itemLink}>
        {typeof icon === "string" ? (
          <Icon className={classes.itemIcon}>{icon}</Icon>
        ) : (
          React.createElement(icon, {
            className: classes.itemIcon
          })
        )}
        <ListItemText primary={primary} className={classNames(classes.itemText, classes.whiteFont)} disableTypography={true} />
        <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction>
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