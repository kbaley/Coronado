import React, { Component } from 'react';
import Select from 'react-select';

export class CategorySelect extends Component {
  constructor(props) {
    super(props);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.state = {
      categoriesLoaded: false
    };
  }

  handleChangeCategory(selectedOption) {
    this.props.onCategoryChanged(selectedOption.categoryId);
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
    return (
        <Select value={this.props.selectedCategory} 
            onChange={this.handleChangeCategory} 
            getOptionLabel={o => o.name}
            getOptionValue={o => o.categoryId}
            options={this.props.categories} styles={customStyles} />);
  }
}