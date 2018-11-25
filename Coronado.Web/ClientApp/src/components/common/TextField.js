import React from 'react';
import { FormControl, FormGroup, ControlLabel, Col } from 'react-bootstrap';

export default function TextField({label, name, value, onChange, width}) {
  return (
    <FormGroup>
      <Col componentClass={ControlLabel} sm={3}>{label}</Col>
      <Col sm={width || 9}>
        <FormControl
          type="text"
          name={name}
          value={value}
          onChange={onChange}
        />
      </Col>
    </FormGroup>
  );
}