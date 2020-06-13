import React, { Fragment } from 'react';
import { Icon } from "../icons/Icon";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, makeStyles } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import PublishIcon from '@material-ui/icons/Publish';

const styles = theme => ({
  dialogPaper: {
    minHeight: 240,
  }
});

const useStyles = makeStyles(styles);

export default function UploadQif({onUpload, account}) {
  const [ selectedFile, setSelectedFile ] = React.useState(null);
  const [ fromDate, setFromDate ] = React.useState(new Date());
  const [ show, setShow ] = React.useState(false);
  const [ filename, setFilename ] = React.useState('No file selected');

  const handleSelectedFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setFilename(event.target.files[0].name);
  }

  const handleChangeDate = (date) => {
    setFromDate(date);
  }

  const showUploadForm = () => {
    setShow(true);
  }

  const closeUploadForm = () => {
    setShow(false);
  }

  const onSave = () => {
    onUpload(selectedFile, fromDate);
    closeUploadForm();
  }

  const classes = useStyles();
    return (
      <Fragment>
        <Icon 
          onClick={showUploadForm} 
          icon={<PublishIcon />}
        />
        <Dialog
          onClose={closeUploadForm}
          open={show}
          classes={{paper: classes.dialogPaper }}
        >
          <DialogTitle>Upload transactions to: {account.name}</DialogTitle>
          <DialogContent>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container spacing={3}>
                <Grid item xs={12}>

                  <input
                    type="file"
                    name="selectedFile"
                    id='selectedFile'
                    onChange={handleSelectedFile}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor='selectedFile'>
                    <Button variant="outlined" component="span">Select file</Button>
                  </label>
                  <label style={{ marginLeft: 20 }}>
                    {filename}
                  </label>
                </Grid>
                <Grid item xs={12}>
                  <KeyboardDatePicker
                    value={fromDate}
                    onChange={handleChangeDate}
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
            <Button onClick={onSave}>Upload</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
};
