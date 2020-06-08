import React from 'react';
import * as categoryActions from '../../actions/categoryActions';
import { useDispatch, useSelector } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import CategoryForm from './CategoryForm';
import { NewIcon } from '../icons/NewIcon';
import './NewCategory.css';

export default function NewCategory() {
  const [show, setShow] = React.useState(false);
  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories);

  React.useEffect(() => {
    Mousetrap.bind('n c', showForm);

    return function cleanup() {
      Mousetrap.unbind('n c');
    }
  })

  const showForm = () => {
    setShow(true);
    return false;
  }

  const saveCategory = (category) => {
    dispatch(categoryActions.createCategory(category));
  }

  const handleClose = () => {
    setShow(false);
  }
    return (<span>
        <NewIcon onClick={showForm} className="new-category"/>
        <CategoryForm show={show} onClose={handleClose} onSave={saveCategory}
          categories={categories} />
      </span>);
}
