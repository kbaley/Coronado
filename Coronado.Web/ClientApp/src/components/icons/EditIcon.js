import React from 'react';
import './EditIcon.css'
import './Icon.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function EditIcon(props) {
  const classes = `${props.className}`
  return (
    <div className="edit-icon icon"><FontAwesomeIcon icon='pencil-alt' className={classes} onClick={props.onStartEditing} /></div>
  );
}