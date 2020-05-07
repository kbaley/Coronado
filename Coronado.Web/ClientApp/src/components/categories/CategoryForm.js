import React, { Component } from 'react';
import { Button, Dialog, DialogTitle, Grid, TextField, Select, MenuItem, 
  DialogContent, DialogActions, InputLabel, FormControl } from '@material-ui/core';

class CategoryForm extends Component {
  displayName = CategoryForm.name;
  initialState = {
    newCategory: true,
    category: { name: '', type: '', parentCategoryId: '' }
  }
  constructor(props) {
    super(props);
    this.saveCategory = this.saveCategory.bind(this);   
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeParent = this.handleChangeParent.bind(this);
    this.state = Object.assign({}, this.initialState);
  }

  componentDidUpdate() {
    if (this.props.category && this.props.category.categoryId && this.props.category.categoryId !== this.state.category.categoryId ) {
      this.setState({
        newCategory: false,
        category: {
          categoryId: this.props.category.categoryId,
          name: this.props.category.name,
          type: this.props.category.type,
          parentCategoryId: this.props.category.parentCategoryId || ''
        }
      });
    }
  }

  saveCategory() {
    this.props.onSave(this.state.category);
    this.setState(Object.assign({}, this.initialState));
    this.props.onClose();
  }

  handleChangeField(e) {
    const name = e.target.name;
    this.setState( { category: {...this.state.category, [name]: e.target.value } } );
  }

  handleChangeParent(e) {
    this.setState({ category: { ...this.state.category, parentCategoryId: e.target.value } } );
  }
  render() {
    return (
      <Dialog
        onClose={this.props.onClose}
        open={this.props.show}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>New category</DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              autoFocus
              name="name"
              label="Category name"
              value={this.state.category.name}
              onChange={this.handleChangeField}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="type"
              label="Type"
              value={this.state.category.type}
              onChange={this.handleChangeField}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl>
            <InputLabel id="parent-category">Parent category</InputLabel>
            <Select
              labelId="parent-category"
              value={this.state.category.parentCategoryId}
              style={{minWidth: 150}}
              onChange={this.handleChangeParent}
            >
              <MenuItem value={''}>None</MenuItem>
              {this.props.categories ? this.props.categories.map(c => 
              (c.categoryId !== this.state.category.categoryId) &&
                <MenuItem value={c.categoryId} key={c.categoryId}>{c.name}</MenuItem>
                ) : <MenuItem>Select...</MenuItem>
              }
            </Select>
            </FormControl>
          </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.saveCategory}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  };
}

export default CategoryForm;
