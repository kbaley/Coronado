import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import './CheckIcon.css';

export function CheckIcon(props) {
  const classes = `check-icon ${props.className}`
  return (
    <Glyphicon glyph='ok' className={classes} onClick={props.onClick} />
  );
}