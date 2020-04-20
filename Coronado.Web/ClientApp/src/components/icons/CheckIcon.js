import React from 'react';
import './CheckIcon.css';
import './Icon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function CheckIcon(props) {
  const classes = `check-icon icon ${props.className || ''}`
  return (
    <FontAwesomeIcon icon='check-circle' className={classes} onClick={props.onClick} />
  );
}