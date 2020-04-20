import React from 'react';
import './Icon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Icon(props) {
  const classes = `icon ${props.className}`
  return (
    <FontAwesomeIcon icon={props.glyph} className={classes} onClick={props.onClick} title={props.title || ""}/>
  );
}