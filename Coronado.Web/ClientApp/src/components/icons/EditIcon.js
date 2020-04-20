import React from 'react';
import './EditIcon.css'
import './Icon.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function EditIcon(props) {
  const classes = `edit-icon icon ${props.className}`
  return (
    <FontAwesomeIcon icon='pencil-alt' className={classes} onClick={props.onStartEditing} />
  );
}