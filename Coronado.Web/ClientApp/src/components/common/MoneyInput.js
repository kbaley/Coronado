import React from 'react';

export function MoneyInput(props) {
  const {className} = props;
  return (<input 
    type="text" 
    name={props.name} 
    className={className}
    value={props.value} 
    style={{textAlign: "right"}}
    onChange={props.onChange} 
    onKeyPress={props.onKeyPress} />);
}