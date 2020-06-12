import React from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';

export default function NewInvoice({onUpload, onHide, show}) {
  const [ selectedFile, setSelectedFile ] = React.useState(null);
  const [ filename, setFilename ] = React.useState("No file selected");

  const handleSelectedFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setFilename(event.target.files[0].name);
  }

  const uploadTemplate = () => {
    onUpload(selectedFile);
  }

    return (
      <span>
        <Dialog
          onClose={onHide}
          open={show}
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogTitle>Invoice Template</DialogTitle>
          <DialogContent>
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
            <label style={{marginLeft: 20}}>
              {filename}
            </label>
          </DialogContent>
          <DialogActions>
            <Button onClick={uploadTemplate}>Upload</Button>
          </DialogActions>
        </Dialog>
      </span>);
}
