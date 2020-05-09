import React from 'react';
import MuiEditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import { PropTypes } from 'prop-types';

export function EditIcon(props) {
  return (
    <IconButton onClick={props.onStartEditing} component="span">
      <MuiEditIcon />
    </IconButton>
  );
}

EditIcon.propTypes = {
  onStartEditing: PropTypes.func.isRequired,
}