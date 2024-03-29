import React from 'react';
import { IconButton } from '@material-ui/core';
import { PropTypes } from 'prop-types';

export function Icon({ onClick, icon, title, component="span", ...rest}) {
  return (
    <IconButton onClick={onClick} component={component} title={title} {...rest} >
      {icon}
    </IconButton>
  );
}

Icon.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  icon: PropTypes.object,
}