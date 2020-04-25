import React from 'react';
import './CancelIcon.css';
import './Icon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function CancelIcon(props) {
  const classes = `cancel-icon icon ${props.className}`
  return (
    <div className={classes}><FontAwesomeIcon icon='minus-circle' onClick={props.onCancel} fixedWidth /></div>
  );
}