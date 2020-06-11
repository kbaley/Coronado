import React from 'react';

export default function DateFormat(date) {
  return (
    <React.Fragment>{new Date(date).toLocaleDateString()}</React.Fragment>
  );
}