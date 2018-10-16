import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import './CancelIcon.css';
import './Icon.css';

export function CancelIcon(props) {
  const classes = `cancel-icon icon ${props.className}`
  return (
    <Glyphicon glyph='remove' className={classes} onClick={props.onCancel} />
  );
}