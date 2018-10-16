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

  componentDidUpdate() {
      // if (this.state.categories.length === 0 && this.props.categories.length > 0 && !this.state.categoriesLoaded) {
      //   this.setState(
      //     {
      //       categories: this.props.categories.map(c => {return {value: c.categoryId, label: c.name}}),
      //       categoriesLoaded: true
      //     })
      // }
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
        minHeight: 27,
        height: 27,
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