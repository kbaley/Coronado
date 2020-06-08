import React from 'react';
import { useSelector } from 'react-redux';
import CategoryList from './CategoryList';
import NewCategory from './NewCategory';

export default function Categories() {

  const categories = useSelector(state => state.categories);

  return (
    <div>
      <h1>
        Categories
          <NewCategory />
      </h1>
      <CategoryList categories={categories} />
    </div>
  );
}