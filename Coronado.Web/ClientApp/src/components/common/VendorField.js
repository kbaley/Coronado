import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

export default function VendorField(props) {
  const [value, setValue] = React.useState(props.value);
  const [options, setOptions] = React.useState([]);
  const { vendors, onVendorChanged } = props;

  React.useEffect(() => {
    if (vendors && vendors.length > 0) {
      setOptions(vendors);
    }
  }, [vendors]);

  React.useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const onChange = (_, newValue) => {
    setValue(newValue)
    onVendorChanged(newValue);
  };

  const getOptionSelected = (option, value) => {
    return option && option.name === value;
  } 

  const getOptionLabel = (option) => {
    if (option.name) return option.name;
    return option;
  }

  return (
    <Autocomplete
      openOnFocus={false}
      value={value}
      freeSolo
      options={options}
      onChange={onChange}
      autoSelect
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      renderInput={(params) => <TextField 
        {...params} 
        className={props.className} 
      />}
    />
  );
}