import React, { Component, Fragment } from 'react';
import { Icon } from "../icons/Icon";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, withStyles } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const styles = theme => ({
  dialogPaper: {
    minHeight: 240,
  }
});

class UploadQif extends Component {
  constructor(props) {
    super(props);

    this.showUploadForm = this.showUploadForm.bind(this);
    this.closeUploadForm = this.closeUploadForm.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {
      selectedFile: null,
      fromDate: new Date(),
      show: false,
      filename: 'No file selected'
    }
  }

  handleSelectedFile(event) {
    this.setState({
      selectedFile: event.target.files[0],
      filename: event.target.files[0].name
    })
  }

  handleChangeDate(date) {
    this.setState({
      fromDate: date
    });
  }

  showUploadForm() {
    this.setState({ show: true });
  }

  closeUploadForm() {
    this.setState({ show: false });
  }

  onSave() {
    this.props.onUpload(this.state.selectedFile, this.state.fromDate);
    this.closeUploadForm();
  }
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Icon className="upload-qif" glyph="upload" onClick={this.showUploadForm} />
        <Dialog
          onClose={this.closeUploadForm}
          open={this.state.show}
          classes={{paper: classes.dialogPaper }}
        >
          <DialogTitle>Upload transactions to: {this.props.account.name}</DialogTitle>
          <DialogContent>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container spacing={3}>
                <Grid item xs={12}>

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
                  <label style={{ marginLeft: 20 }}>
                    {this.state.filename}
                  </label>
                </Grid>
                <Grid item xs={12}>
                  <KeyboardDatePicker
                    value={this.state.fromDate}
                    onChange={this.handleChangeDate}
                    disableToolbar
                    format="MM/dd/yyyy"
                    variant="inline"
                    label="Starting from date"
                    name="fromDate"
                  />
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onSave}>Upload</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
};

export default (withStyles(styles)(UploadQif));