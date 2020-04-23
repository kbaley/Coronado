import React from 'react';
import './CancelIcon.css';
import './Icon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function CancelIcon(props) {
  const classes = `cancel-icon icon ${props.className}`
  return (
    <FontAwesomeIcon icon='minus-circle' className={classes} onClick={props.onCancel}/>
  );
}