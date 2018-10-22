import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import './CheckIcon.css';
import './Icon.css';

export function CheckIcon(props) {
  const classes = `check-icon icon ${props.className}`
  return (
    <a onClick={props.onClick} style={{color:"black"}}>
    <Glyphicon glyph='ok' className={classes} />
    </a>
  );
}