import React, { Component } from 'react';
import { Button,Modal,Form,FormControl,FormGroup,Col } from 'react-bootstrap';

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
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>New category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <Col as={Form.Label} sm={3}>Category Name</Col>
              <Col sm={9}>
            <FormControl
              type="text" autoFocus
              name="name" ref="inputName"
              value={this.state.category.name}
              onChange={this.handleChangeField}
            />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col as={Form.Label} sm={3}>Type</Col>
              <Col sm={5}>
                <FormControl type="text" value={this.state.category.type}
                  name="type"
                  onChange={this.handleChangeField}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col as={Form.Label} sm={3}>Parent Category</Col>
              <Col sm={5}>
                <FormControl as="select" name="parentCategory" value={this.state.category.parentCategoryId}
                    onChange={this.handleChangeParent}>
                  <option key="0" value="">None</option>
                  {this.props.categories ? this.props.categories.map(c => 
                  (c.categoryId !== this.state.category.categoryId) &&
                  <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                  ) : <option>Select...</option>}
                </FormControl>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.saveCategory}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

export default CategoryForm;
