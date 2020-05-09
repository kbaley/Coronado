import React from 'react';
import MuiEditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import { PropTypes } from 'prop-types';

export function EditIcon({onStartEditing, fontSize, ...rest}) {
  return (
    <IconButton onClick={onStartEditing} component="span" {...rest}>
      <MuiEditIcon 
        fontSize={fontSize ?? "default"}
      />
    </IconButton>
  );
}

EditIcon.propTypes = {
  onStartEditing: PropTypes.func.isRequired,
  fontSize: PropTypes.string
}