import React, { Component } from 'react';
import Select from 'react-select';
import { find } from 'lodash';

export class CategorySelect extends Component {
  constructor(props) {
    super(props);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.state = {
      categories: this.props.categories.map(c => {return {value: c.categoryId, label: c.name}}),
      categoriesLoaded: false
    };
  }

  componentDidMount() {
    this.setState({selectedCategory: find(this.state.categories, c => c.value === this.props.selectedCategoryId)})
  }

  componentDidUpdate() {
      if (this.state.categories.length === 0 && this.props.categories.length > 0 && !this.state.categoriesLoaded) {
        this.setState(
          {
            categories: this.props.categories.map(c => {return {value: c.categoryId, label: c.name}}),
            categoriesLoaded: true
          })
      }
  }

  handleChangeCategory(selectedOption) {
    this.props.onCategoryChanged(selectedOption.value);
    this.setState({ selectedCategory: selectedOption });
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
        <Select value={this.state.selectedCategory} 
            onChange={this.handleChangeCategory} 
            options={this.state.categories} styles={customStyles} />);
  }
}