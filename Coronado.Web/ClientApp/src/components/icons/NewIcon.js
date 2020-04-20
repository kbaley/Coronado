import React from 'react';
import './NewIcon.css';
import './Icon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function NewIcon(props) {
  const classes = `new-icon icon ${props.className}`
  return (
    <FontAwesomeIcon icon='plus-circle' className={classes} onClick={props.onClick}/>
  );
}