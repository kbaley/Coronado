import React from 'react';
import MuiDeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import { PropTypes } from 'prop-types';

export function DeleteIcon({ onDelete, ...rest}) {
  return (
    <IconButton onClick={onDelete} component="span" {...rest} >
      <MuiDeleteIcon/>
    </IconButton>
  );
}

DeleteIcon.propTypes = {
  onDelete: PropTypes.func.isRequired,
}