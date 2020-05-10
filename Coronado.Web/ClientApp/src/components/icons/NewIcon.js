import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { IconButton } from '@material-ui/core';
import { PropTypes } from 'prop-types';

export function NewIcon({onClick, fontSize, ...rest}) {
  return (
    <IconButton onClick={onClick} component="span" {...rest}>
      <AddCircleIcon 
        fontSize={fontSize ?? "default"}
      />
    </IconButton>
  );
}

NewIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  fontSize: PropTypes.string
}