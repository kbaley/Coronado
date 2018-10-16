import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import './CancelIcon.css';

export function CancelIcon(props) {
  const classes = `cancel-icon ${props.className}`
  return (
    <Glyphicon glyph='remove' className={classes} onClick={props.onCancel} />
  );
}