import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import { clone, find, forEach, sumBy } from 'lodash';
import { useSelector } from 'react-redux';

export default function AdjustPercentages(props) {

  const [ investmentCategories, setInvestmentCategories ] = React.useState([]);
  const [name, setName] = React.useState('');
  const [percentage, setPercentage] = React.useState(0);
  const investments = useSelector(state => state.investments);
  
  React.useEffect(() => {
    if (props.investmentCategories) {
      setInvestmentCategories([...props.investmentCategories]);
    }
  }, [props.investmentCategories]);

  React.useEffect(() => {
      const totalPercentage = sumBy(investmentCategories, c => c.percentage);
      const totalInvestments = sumBy(investments, i => (i.categoryId ? i.currentValue : 0));

      forEach(investmentCategories, ic => {
          ic.totalPercentage = (ic.percentage * 100 / totalPercentage).toFixed(2);
          const total = sumBy(investments, i => (i.categoryId === ic.investmentCategoryId ? i.currentValue : 0));
          ic.actualPercentage = (total * 100 / totalInvestments).toFixed(2);
      });
  }, [investmentCategories, investments]);

  const savePercentages = () => {
    props.onSaveCategories(investmentCategories);
  }

  const handleChangeName = (e) => {
    setName(e.target.value);
  }

  const handleChangePercentage = (e) => {
    setPercentage(e.target.value);
  }

  const saveCategory = () => {
    var newCategory = {
      investmentCategoryId: uuidv4(),
      name,
      percentage,
      status: 'added'
    };
    setInvestmentCategories(
      [...investmentCategories, Object.assign({}, newCategory)]
    );
    setName('');
    setPercentage(0);
  }

  const onCategoryDeleted = (categoryId) => {
    const categories = clone(investmentCategories);
    const category = find(categories, c => c.investmentCategoryId === categoryId);
    category.status = "deleted";
    setInvestmentCategories(categories);
  }

  return (
    <Dialog
      onClose={props.onClose}
      open={props.show}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogContent>
        <Grid container spacing={2}>

          <Grid item xs={2}>Name</Grid>
          <Grid item xs={2}>Ratio</Grid>
          <Grid item xs={3}>Expected %</Grid>
          <Grid item xs={3}>Current %</Grid>
          <Grid item xs={2}></Grid>
          {investmentCategories && investmentCategories.filter(c => c.status !== "deleted").map((c, i) =>
            <React.Fragment key={c.investmentCategoryId}>
            <Grid item xs={2}>{c.name}</Grid>
            <Grid item xs={2}>{c.percentage}</Grid>
            <Grid item xs={3}>{c.totalPercentage}%</Grid>
            <Grid item xs={3}>{c.actualPercentage}%</Grid>
            <Grid item xs={2}>
              <DeleteIcon onClick={() => onCategoryDeleted(c.investmentCategoryId)} />
            </Grid>
            </React.Fragment>
          )}
          <Grid item xs={5}>
            <TextField
              name="name"
              label="Name"
              fullWidth={true}
              value={name}
              onChange={handleChangeName}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              name="percentage"
              label="Percentage"
              fullWidth={true}
              value={percentage}
              onChange={handleChangePercentage}
            />
          </Grid>
          <Grid item xs={2}>
            <SaveIcon onClick={saveCategory} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={savePercentages}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

