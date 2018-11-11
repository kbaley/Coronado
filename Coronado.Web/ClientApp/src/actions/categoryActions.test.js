import { loadCategories, updateCategory, createCategory, deleteCategory } from "./categoryActions";
import { LOAD_CATEGORIES_SUCCESS, UPDATE_CATEGORY_SUCCESS, CREATE_CATEGORY_SUCCESS, 
  DELETE_CATEGORY } from "../constants/categoryActionTypes";

describe('categoryActions tests', () => {
  const mockCategories = [{categoryId: "123", name: "Moo"}, {categoryId: "qwe", name: "Things"}];

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should load categories', async () => {
  
    // ARRANGE
    const dispatch = jest.fn();
    fetch.mockResponseOnce(JSON.stringify(mockCategories));

    // ACT
    await loadCategories()(dispatch)

    // ASSERT
    expect(dispatch).toBeCalledWith({type: LOAD_CATEGORIES_SUCCESS, categories: mockCategories});

  });

  it('should update a category', async () => {

    // ARRANGE
    const dispatch = jest.fn();
    const mockCategory = {categoryId: "moo", name: "Moo", type: "Expense"};
    const category = {categoryId: "moo", name: "Moo", type: "Expense"};
    fetch.mockResponseOnce(JSON.stringify(mockCategory));
    
    // ACT
    await updateCategory(category)(dispatch);

    // ASSERT
    expect(dispatch).toBeCalledWith({category: mockCategory, type: UPDATE_CATEGORY_SUCCESS})
  });

  it('should create a category', async () => {

    // ARRANGE
    const dispatch = jest.fn();
    const mockCategory = {categoryId: "moo", name: "Moo", type: "Expense"};
    const category = {name: "Moo", type: "Expense"};
    fetch.mockResponseOnce(JSON.stringify(mockCategory));
    
    // ACT
    await createCategory(category)(dispatch);

    // ASSERT
    expect(dispatch).toBeCalledWith({category: mockCategory, type: CREATE_CATEGORY_SUCCESS});
  });

  it('should delete a category', async () => {
    // ARRANGE
    const dispatch = jest.fn();
    const categoryId = "moo";
    
    // ACT
    await deleteCategory(categoryId)(dispatch);

    // ASSERT
    expect(dispatch).toBeCalledWith({categoryId, type: DELETE_CATEGORY});
  });
});