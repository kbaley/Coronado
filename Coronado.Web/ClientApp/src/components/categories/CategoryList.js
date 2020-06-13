import React from 'react';
import * as categoryActions from '../../actions/categoryActions';
import { useDispatch, useSelector } from 'react-redux';
import CategoryForm from './CategoryForm';
import { find } from 'lodash';
import { CategoryRow } from './CategoryRow';
import Spinner from '../common/Spinner';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';

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
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={{ width: 130 }}></TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Parent</TableCell>
        </TableRow>
      </TableHead>
      <CategoryForm
        show={show}
        onClose={handleClose}
        category={selectedCategory}
        categories={categories}
        onSave={saveCategory} />
      <TableBody>
        {isLoading ? <tr><td colSpan="5"><Spinner /></td></tr> :
          categories.map(cat =>
            <CategoryRow
              key={cat.categoryId}
              parent={getCategoryName(cat.parentCategoryId)}
              category={cat}
              onEdit={() => startEditing(cat)}
              onDelete={() => deleteCategory(cat.categoryId, cat.name)} />
          )}
      </TableBody>
    </Table>
  );
}