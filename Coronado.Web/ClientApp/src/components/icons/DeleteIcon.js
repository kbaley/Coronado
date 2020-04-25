import React from 'react';
import './DeleteIcon.css';
import './Icon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function DeleteIcon(props) {
  const classes = `${props.className}`
  return (
    <div className="delete-icon icon"><FontAwesomeIcon icon='trash-alt' className={classes} onClick={props.onDelete} fixedWidth /></div>
  );
}