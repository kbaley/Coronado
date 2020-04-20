import React from 'react';
import './DeleteIcon.css';
import './Icon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function DeleteIcon(props) {
  const classes = `delete-icon icon ${props.className}`
  return (
    <FontAwesomeIcon icon='trash-alt' className={classes} onClick={props.onDelete} />
  );
}