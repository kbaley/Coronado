import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import { find } from 'lodash';

export class CategorySelect extends Component {
  constructor(props) {
    super(props);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.state = {
      categoriesLoaded: false
    };
  }

  handleChangeCategory(selectedOption, actionMeta) {
    console.log(actionMeta);
    console.log(selectedOption);
    
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
        width: 200,
        minHeight: 25,
        height: 25,
        borderRadius: 0
      })
    };
    const options = this.props.categories.filter(c => c.accountId !== this.props.selectedAccount);
    return (
      <CreatableSelect 
        isClearable
        value={find(options, o => o.categoryId === this.props.selectedCategory)} 
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