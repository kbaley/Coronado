import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import './Icon.css';

export function Icon(props) {
  const classes = `icon ${props.className}`
  return (
    <Glyphicon glyph={props.glyph} className={classes} onClick={props.onClick}/>
  );
}