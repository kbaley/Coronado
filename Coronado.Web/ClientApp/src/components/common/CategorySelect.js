import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

export class CategorySelect extends Component {
  constructor(props) {
    super(props);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.state = {
      categoriesLoaded: false
    };
  }

  handleChangeCategory(selectedOption, actionMeta) {
    
    this.props.onCategoryChanged(selectedOption);
  }

  // See https://github.com/JedWatson/react-select/issues/2630
  isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (
      inputValue.trim().length === 0 ||
      selectOptions.find(option => option.name === inputValue)
    ) {
      return false;
    }
    return true;
  }

  render() {
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
    const options = this.props.categories.filter(c => c.accountId !== this.props.selectedAccount);
    return (
      <CreatableSelect 
        value={this.props.selectedCategory}
        onChange={this.handleChangeCategory} 
        getOptionLabel={o => o.name}
        getOptionValue={o => o.categoryId}
        getNewOptionData={(inputValue, optionLabel) => ({
          id: inputValue,
          name: optionLabel,
        })}
        isValidNewOption={this.isValidNewOption}
        options={options} styles={customStyles} />);
  }
}