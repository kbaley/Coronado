import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TransactionInput } from '../TransactionInput';

export default function VendorField({vendors, onVendorChanged, value, className, ...rest}) {
  const [selectedVendor, setSelectedVendor] = React.useState(value);
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    if (vendors && vendors.length > 0) {
      setOptions(vendors);
    }
  }, [vendors]);

  React.useEffect(() => {
    setSelectedVendor(value);
  }, [value]);

  const onChange = (_, newValue) => {
    setSelectedVendor(newValue)
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
      value={selectedVendor}
      freeSolo
      options={options}
      onChange={onChange}
      autoSelect
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      renderInput={(params) => <TransactionInput
        ref={params.InputProps.ref}
        fullWidth
        inputProps={params.inputProps}
        className={className} 
      />}
    />
  );
}