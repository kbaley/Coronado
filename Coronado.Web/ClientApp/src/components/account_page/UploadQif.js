import React, {Component, Fragment} from 'react';
import { Button, Modal, Form, FormControl, FormGroup, ControlLabel, Col} from 'react-bootstrap';
import {Icon} from "../icons/Icon";
import "./UploadQif.css";

class UploadQif extends Component {
  constructor(props) {
    super(props);

    this.showUploadForm = this.showUploadForm.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {
      selectedFile: null,
      fromDate: '',
      show: false
    }
  }

  handleSelectedFile(event) {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  handleChangeDate(event) {
    this.setState({
      fromDate: event.target.value
    });
  }

  showUploadForm() {
    this.setState({show: true});
  }

  onSave() {
    this.props.onUpload(this.state.selectedFile, this.state.fromDate);
  }
  render() {
  return (
    <Fragment>
      <Icon className="upload-qif" glyph="upload" onClick={this.showUploadForm} />
      <Modal show={this.state.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload transactions to: {this.props.account.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>QIF File</Col>
              <Col sm={9}>
                <input type="file" name="selectedFile" onChange={this.handleSelectedFile} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>From date:</Col>
              <Col sm={4}>
                <FormControl type="text" name="fromDate" value={this.state.fromDate} onChange={this.handleChangeDate} />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onSave}>Upload</Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
          }
};

export default UploadQif;