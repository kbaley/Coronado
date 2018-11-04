import React, { Component } from 'react';
import Select from 'react-select';
import { each, find } from 'lodash';

export class CategorySelect extends Component {
  constructor(props) {
    super(props);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.state = {
      categoriesLoaded: false
    };
  }

  handleChangeCategory(selectedOption) {
    this.props.onCategoryChanged(selectedOption);
  }

  getOptions() {
    let categoryList = this.props.categories.slice();
    each (this.props.accounts, a => {
      if (a.accountId !== this.props.selectedAccount) {
        categoryList.push({categoryId: 'TRF:' + a.accountId, name: 'TRANSFER: ' + a.name});
      }
    });
    each(this.props.accounts, a => {
      if (a.accountType === "Mortgage" && a.accountId !== this.props.selectedAccount) {
        categoryList.push({categoryId: 'MRG:' + a.accountId, name: 'MORTGAGE: ' + a.name});
      }
    });
    return categoryList;
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
    const options = this.getOptions();
    
    return (
      <Select value={find(options, o => o.categoryId === this.props.selectedCategory)} 
        onChange={this.handleChangeCategory} 
        getOptionLabel={o => o.name}
        getOptionValue={o => o.categoryId}
        options={options} styles={customStyles} />);
  }
}