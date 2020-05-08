import React from 'react';
import MuiEditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';

export function EditIcon(props) {
  return (
    <IconButton onClick={props.onStartEditing} component="span">
      <MuiEditIcon onClick={props.onStartEditing} />
    </IconButton>
  );
}