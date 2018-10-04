import React from 'react';
import { Glyphicon } from 'react-bootstrap';

export function DeleteIcon(props) {
  return (<a onClick={props.onDelete} className="delete-icon">
    <Glyphicon glyph='remove-sign' />
  </a>);
}