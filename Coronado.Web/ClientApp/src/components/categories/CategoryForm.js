import React from 'react';
import {
  Button, Dialog, Grid, TextField, Select, MenuItem,
  DialogContent, DialogActions, InputLabel, FormControl
} from '@material-ui/core';

export default function CategoryForm(props) {
  const defaultCategory = {
    name: '', 
    type: '', 
    parentCategoryId: '',
  }
  const [ category, setCategory ] = React.useState(Object.assign({}, defaultCategory));
  React.useEffect(() => {
    if (props.category && props.category.categoryId && props.category.categoryId !== category.categoryId) {
      setCategory({
        categoryId: props.category.categoryId,
        name: props.category.name,
        type: props.category.type,
        parentCategoryId: props.category.parentCategoryId || '',
      })
    }
  }, [props.category, category.categoryId]);

  const saveCategory = () => {
    props.onSave(category);
    setCategory(Object.assign({}, defaultCategory));
    props.onClose();
  }

  const handleChangeField = (e) => {
    const name = e.target.name;
    setCategory({
      ...category,
      [name]: e.target.value,
    })
  }

  const handleChangeParent = (e) => {
    setCategory({
      ...category,
      parentCategoryId: e.target.value,
    })
  }
    return (
      <Dialog
        onClose={props.onClose}
        open={props.show}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                autoFocus
                name="name"
                label="Category name"
                value={category.name}
                onChange={handleChangeField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="type"
                label="Type"
                value={category.type}
                onChange={handleChangeField}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl>
                <InputLabel id="parent-category">Parent category</InputLabel>
                <Select
                  labelId="parent-category"
                  value={category.parentCategoryId}
                  style={{ minWidth: 150 }}
                  onChange={handleChangeParent}
                >
                  <MenuItem value={''}>None</MenuItem>
                  {props.categories ? props.categories.map(c =>
                    (c.categoryId !== category.categoryId) &&
                    <MenuItem value={c.categoryId} key={c.categoryId}>{c.name}</MenuItem>
                  ) : <MenuItem>Select...</MenuItem>
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveCategory}>Save</Button>
        </DialogActions>
      </Dialog>
    );
}
