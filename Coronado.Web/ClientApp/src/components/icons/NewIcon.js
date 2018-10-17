import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import './NewIcon.css';
import './Icon.css';

export function NewIcon(props) {
  const classes = `new-icon icon ${props.className}`
  return (
    <Glyphicon glyph='plus-sign' className={classes} onClick={props.onClick} />
  );
}