import React, { Component } from 'react';
import Select from 'react-select';
import { find } from 'lodash';

export class CategorySelect extends Component {
  constructor(props) {
    super(props);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.state = {
      categoriesLoaded: false
    };
  }

  handleChangeCategory(selectedOption) {
    this.props.onCategoryChanged(selectedOption);
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
      <Select value={find(options, o => o.categoryId === this.props.selectedCategory)} 
        onChange={this.handleChangeCategory} 
        getOptionLabel={o => o.name}
        getOptionValue={o => o.categoryId}
        options={options} styles={customStyles} />);
  }
}