import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import './DeleteIcon.css';

export function DeleteIcon(props) {
  const classes = `delete-icon ${props.className}`
  return (
    <Glyphicon glyph='remove-sign' className={classes} onClick={props.onDelete} />
  );
}