import React from 'react';

export function MoneyInput(props) {
  return (<input 
    type="text" 
    name={props.name} 
    value={props.value} 
    style={{textAlign: "right"}}
    onChange={props.onChange} 
    onKeyPress={props.onKeyPress} />);
}