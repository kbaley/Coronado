import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import './EditIcon.css'
import './Icon.css'

export function EditIcon(props) {
  const classes = `edit-icon icon ${props.className}`
  return (
    <Glyphicon glyph='pencil' className={classes} onClick={props.onStartEditing} />
  );
}