import React, { Component } from 'react';
import { Button,Modal,Form,FormControl,FormGroup,ControlLabel,Col } from 'react-bootstrap';
import { actionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class AddCategory extends Component {
  displayName = AddCategory.name;
  constructor(props) {
    super(props);
    this.saveCategory = this.saveCategory.bind(this);   
    this.handleChangeField = this.handleChangeField.bind(this);
    this.state = {
      newCategory: true,
      category: {name: '', type: ''}
    };
    if (this.props.category) {
      this.state = {
        newCategory: false,
        category: {
          name: this.props.category.name,
          type: this.props.category.type
        }
      }
    }
  }

  saveCategory() {
    this.props.onSave(this.state.category);
    this.setState(...this.state, {category: {name: '', type: ''}});
    this.props.onClose();
  }

  handleChangeField(e) {
    var name = e.target.name;
    this.setState( { category: {...this.state.category, [name]: e.target.value } } );
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
              <Col componentClass={ControlLabel} sm={3}>Category Name</Col>
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
              <Col componentClass={ControlLabel} sm={3}>Type</Col>
              <Col sm={5}>
                <FormControl type="text" value={this.state.category.type}
                  name="type"
                  onChange={this.handleChangeField}
                />
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

export default connect(
  state => state.categories,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(AddCategory);