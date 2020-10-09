import React from 'react';
import * as categoryActions from '../../actions/categoryActions';
import { useDispatch, useSelector } from 'react-redux';
import CategoryForm from './CategoryForm';
import { find } from 'lodash';
import { CategoryRow } from './CategoryRow';
import Spinner from '../common/Spinner';
import * as widths from './CategoryWidths';
import { Grid } from '@material-ui/core';
import GridHeader from '../common/grid/GridHeader';

export default function CategoryList() {
  const [show, setShow] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState({});
  const categories = useSelector(state => state.categories);
  const isLoading = useSelector(state => state.loading.categories);
  const dispatch = useDispatch();

  const deleteCategory = (categoryId, categoryName) => {
    dispatch(categoryActions.deleteCategory(categoryId, categoryName));
  }

  const startEditing = (category) => {
    setSelectedCategory(category);
    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
    setSelectedCategory({});
  }

  const saveCategory = (category) => {
    dispatch(categoryActions.updateCategory(category));
  }

  const getCategoryName = (categoryId) => {
    if (!categoryId || categoryId === '') return '';

    var category = find(categories, c => c.categoryId === categoryId);
    return category ? category.name : '';
  }

  return (
    <React.Fragment>

      <CategoryForm
        show={show}
        onClose={handleClose}
        category={selectedCategory}
        categories={categories}
        onSave={saveCategory} />
    <Grid container spacing={0}>
      <GridHeader xs={widths.ICON_WIDTH}></GridHeader>
      <GridHeader xs={widths.NAME_WIDTH}>Name</GridHeader>
      <GridHeader xs={widths.TYPE_WIDTH}>Type</GridHeader>
      <GridHeader xs={widths.PARENT_WIDTH}>Parent</GridHeader>
        {isLoading ? <Grid item xs={12}><Spinner /></Grid> :
          categories.map(cat =>
            <CategoryRow
              key={cat.categoryId}
              parent={getCategoryName(cat.parentCategoryId)}
              category={cat}
              onEdit={() => startEditing(cat)}
              onDelete={() => deleteCategory(cat.categoryId, cat.name)} />
          )}
    </Grid>
    </React.Fragment>
  );
}