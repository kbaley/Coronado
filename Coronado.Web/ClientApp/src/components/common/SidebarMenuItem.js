import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';

export function SidebarMenuItem(props) {
  const { icon, primary, to, secondary } = props;
  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <MenuItem button component={renderLink}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
      {secondary ? secondary : null }
    </MenuItem>
  )
}

SidebarMenuItem.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  secondary: PropTypes.element
}