import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TransactionInput } from '../TransactionInput';

export default function CategorySelect({ categories, selectedCategory, className, 
  onCategoryChanged, selectedAccount, ...rest }) {
  const [options, setOptions] = React.useState([]);
  const [value, setValue] = React.useState(selectedCategory);

  React.useEffect(() => {
    if (categories && categories.length > 0) {
      setOptions(categories.filter(c => c.accountId === undefined || c.accountId !== selectedAccount));
    }
  }, [categories, selectedAccount]);

  React.useEffect(() => {
    setValue(selectedCategory);
  }, [selectedCategory]);

  const handleChangeCategory = (_, newValue) => {
    setValue(newValue);
    if (newValue !== null) {
      if (typeof newValue === 'string') {
        // Might be a new category, might not; let's find out!
        const existing = categories.find(c => c.name === newValue);
        if (!existing) {
          // It's new!
          newValue = {
            categoryId: '',
            name: newValue,
            isNew: true,
          };
        } else {
          newValue = existing;
        }
      }
    }
    onCategoryChanged(newValue);
  }

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    if (option.inputValue) {
      return option.inputValue;
    }
    return option.name;
  }

  const getOptionSelected = (option, value) => {
    return option && option.name === value;
  }

  return (
    <Autocomplete
      openOnFocus={false}
      value={value}
      freeSolo
      options={options}
      onChange={handleChangeCategory}
      autoSelect
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      clearOnBlur
      selectOnFocus
      renderOption={(option) => option.name}
      renderInput={(params) => <TransactionInput
        ref={params.InputProps.ref}
        fullWidth
        inputProps={params.inputProps}
        className={className} 
      />}
    />
  );
}