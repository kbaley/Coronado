import React, { Component } from 'react';
import * as actions from '../../actions/invoiceActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';

export class NewInvoice extends Component {
  constructor(props) {
    super(props);
    this.uploadTemplate = this.uploadTemplate.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
    this.state = {  
      selectedFile: null,
      filename: 'No file selected'
    };
  }

  handleSelectedFile(event) {
    this.setState({
      selectedFile: event.target.files[0],
      filename: event.target.files[0].name
    })
  }

  uploadTemplate() {
    this.props.onUpload(this.state.selectedFile);
  }

  render() {
    return (
      <span>
        <Dialog
          onClose={this.props.onHide}
          open={this.props.show}
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogTitle>Invoice Template</DialogTitle>
          <DialogContent>
            <input 
              type="file" 
              name="selectedFile" 
              id='selectedFile'
              onChange={this.handleSelectedFile}
              style={{ display: 'none' }}
            />
            <label htmlFor='selectedFile'>
              <Button variant="outlined" component="span">Select file</Button>
            </label>
            <label style={{marginLeft: 20}}>
              {this.state.filename}
            </label>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.uploadTemplate}>Upload</Button>
          </DialogActions>
        </Dialog>
      </span>);
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  null,
  mapDispatchToProps
)(NewInvoice);