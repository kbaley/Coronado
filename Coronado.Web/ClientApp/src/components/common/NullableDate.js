import React from 'react';

export function NullableDate({date}) {
  return (
    <span>{date ? new Date(date).toLocaleDateString() : ""}</span>
  );
}

