import React from 'react';
import './Icon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Icon(props) {
  const classes = `icon ${props.className}`
  return (
    <div className={classes}><FontAwesomeIcon icon={props.glyph} onClick={props.onClick} title={props.title || ""}/></div>
  );
}