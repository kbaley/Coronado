import React from 'react';
import { Glyphicon } from 'react-bootstrap';

export function EditIcon(props) {
  return (
    <a onClick={props.onStartEditing} style={{cursor: 'pointer', color: "#000"}}>
    <Glyphicon glyph='pencil' style={{paddingRight: "10px"}}/>
    </a>
  );
}