import React, { Component } from 'react';
import * as actions from '../../actions/invoiceActions';
import { Button, Modal, Form, FormGroup, Col } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './NewInvoice.css';

export class NewInvoice extends Component {
  constructor(props) {
    super(props);
    this.uploadTemplate = this.uploadTemplate.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
    this.state = {  
      selectedFile: null
    };
  }

  handleSelectedFile(event) {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  uploadTemplate() {
    this.props.onUpload(this.state.selectedFile);
  }

  render() {
    return (
      <span>
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <Modal.Header closeButton>
            <Modal.Title>Invoice Template</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormGroup>
                <Col as={Form.Label} sm={3}>Select file:</Col>
                <Col sm={9}>
                  <input type="file" name="selectedFile" onChange={this.handleSelectedFile} />
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.uploadTemplate}>Upload</Button>
          </Modal.Footer>
        </Modal>  
      </span>);
  };
}

function mapStateToProps(state) {
  return {
    invoices: state.invoices,
    customers: state.customers
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewInvoice);