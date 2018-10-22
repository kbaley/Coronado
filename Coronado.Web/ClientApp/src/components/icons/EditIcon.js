import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import './EditIcon.css'
import './Icon.css'

export function EditIcon(props) {
  const classes = `edit-icon icon ${props.className}`
  return (
    <a onClick={props.onStartEditing} style={{color:'black'}}>
      <Glyphicon glyph='pencil' className={classes}/>
    </a>
  );
}