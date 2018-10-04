import React, { Component } from 'react';
import { Glyphicon,Button,Modal,Form,FormControl,FormGroup,ControlLabel,Col } from 'react-bootstrap';
import { actionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class AddCategory extends Component {
  displayName = AddCategory.name;
  constructor(props) {
    super(props);
    this.saveCategory = this.saveCategory.bind(this);   
    this.showForm = this.showForm.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = { show: false, 
        category: {name: '', type: ''}
    };
  }

  showForm() {
    this.setState({show:true});
  }

  saveCategory() {
    this.props.saveNewCategory(this.state.category);
    this.setState(...this.state, {category: {name: '', type: ''}});
    this.handleClose();
  }

  handleChangeName(e) {
    var name = e.target.name;
    this.setState( { category: {...this.state.category, [name]: e.target.value } } );
  }

  handleClose() {
    this.setState({show:false});
  }
  render() {
    return (<span className='add-icon'>
        <a onClick={this.showForm}>
        <Glyphicon glyph='plus-sign' />
        </a>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>New category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Category Name</Col>
                <Col sm={9}>
              <FormControl
                type="text"
                name="name"
                value={this.state.category.name}
                onChange={this.handleChangeName}
              />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Type</Col>
                <Col sm={5}>
                  <FormControl type="text" value={this.state.category.type}
                    name="type"
                    onChange={this.handleChangeName}
                  />
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.saveCategory}>Save</Button>
          </Modal.Footer>
        </Modal>
      </span>);
  };
}

export default connect(
  state => state.categories,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(AddCategory);