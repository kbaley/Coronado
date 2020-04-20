import React from 'react';
import { FormControl, FormGroup, Form, Col } from 'react-bootstrap';

export default function TextField({label, name, value, onChange, width}) {
  return (
    <FormGroup>
      <Col as={Form.Label} sm={3}>{label}</Col>
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