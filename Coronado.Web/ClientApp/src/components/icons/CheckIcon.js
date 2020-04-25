import React from 'react';
import './CheckIcon.css';
import './Icon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function CheckIcon(props) {
  const classes = `check-icon icon ${props.className || ''}`
  return (
    <div className={classes}><FontAwesomeIcon icon='check-circle' onClick={props.onClick} fixedWidth /></div>
  );
}