import React from 'react';
import CreatableSelect from 'react-select/creatable';

export default function CategorySelect(props) {

  const handleChangeCategory = (selectedOption, actionMeta) => {
    props.onCategoryChanged(selectedOption);
  }

  // See https://github.com/JedWatson/react-select/issues/2630
  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (
      inputValue.trim().length === 0 ||
      selectOptions.find(option => option.name === inputValue)
    ) {
      return false;
    }
    return true;
  }

    const customStyles = {
      option: (base) => ({
        ...base,
      }),
      control: (base) => ({
        ...base,
        minHeight: "25px",
        borderRadius: 0,
        height: 25
      }),
      valueContainer: base => ({
        ...base,
        padding: "0px 8px",
        height: 25
      }),
      indicatorsContainer: base => ({
        ...base,
        height: "25px"
      }),
      clearIndicator: base => ({
        ...base,
        padding: "3px"
      }),
      dropdownIndicator: base => ({
        ...base,
        padding: "3px"
      })
    };
    const options = props.categories.filter(c => c.accountId !== props.selectedAccount);
    return (
      <CreatableSelect 
        value={props.selectedCategory}
        onChange={handleChangeCategory} 
        getOptionLabel={o => o.name}
        getOptionValue={o => o.categoryId}
        getNewOptionData={(inputValue, optionLabel) => ({
          id: inputValue,
          name: optionLabel,
        })}
        isValidNewOption={isValidNewOption}
        options={options} styles={customStyles} />
  );
}