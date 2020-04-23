import React from 'react';
import './Icon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Icon(props) {
  const classes = `${props.className}`
  return (
    <div className="icon"><FontAwesomeIcon icon={props.glyph} className={classes} onClick={props.onClick} title={props.title || ""}/></div>
  );
}