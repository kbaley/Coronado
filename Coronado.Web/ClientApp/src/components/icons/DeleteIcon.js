import React from 'react';
import MuiDeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

export function DeleteIcon(props) {
  return (
    <IconButton onClick={props.onDelete} component="span" {...props} >
      <MuiDeleteIcon/>
    </IconButton>
  );
}