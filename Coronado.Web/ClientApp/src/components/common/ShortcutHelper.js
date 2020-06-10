import React from 'react';
import * as Mousetrap from 'mousetrap';
import './ShortcutHelper.css';
import routes from '../../routes';
import { Dialog, DialogTitle, Grid, makeStyles } from '@material-ui/core';
import history from '../../history';

const styles = () => ({
  grid: {
    margin: 0,
    padding: "0 10px",
    width: "100%",
  }
});
  const useStyles = makeStyles(styles);

export default function ShortcutHelper() {
  const [ show, setShow ] = React.useState(false);
  const classes = useStyles();

  React.useEffect(() => {
    Mousetrap.bind('?', showHelp);
    routes.filter(r => r.shortcut).map(route => {
      return Mousetrap.bind(route.shortcut, () => {
        history.push(route.path);
      });
    });
  }, []);

  const showHelp = () => {
    setShow(true);
  }
  const handleClose = () => {
    setShow(false);
  }

    return (
      <Dialog onClose={handleClose}
        open={show}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle>Shortcuts</DialogTitle>
        <Grid container spacing={2} className={classes.grid}>
          <Grid item xs={2}>g [1-9]</Grid>
          <Grid item xs={10}>Go to account</Grid>
          <Grid item xs={2}>n a</Grid>
          <Grid item xs={10}>New account</Grid>
                <Grid item xs={2}>n t</Grid>
                <Grid item xs={10}>(On an account listing) New transaction</Grid>
                <Grid item xs={2}>g d</Grid>
                <Grid item xs={10}>Go to the dashboard</Grid>
                <Grid item xs={2}>g i</Grid>
                <Grid item xs={10}>Go to the investments page</Grid>
                <Grid item xs={2}>g r</Grid>
                <Grid item xs={10}>Go to the reports page</Grid>
                <Grid item xs={2}>g n</Grid>
                <Grid item xs={10}>Go to the invoices page</Grid>
                <Grid item xs={2}>n i</Grid>
                <Grid item xs={10}>(On the invoices page) Create a new invoice</Grid>
                <Grid item xs={2}>n c</Grid>
                <Grid item xs={10}>(On the categories page) Create a new category</Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={10}>Include <span style={{fontFamily: "monospace"}}>
                  bf: &lt;amount&gt; &lt;bank fee description&gt;</span> in a transaction description to 
                  automatically add one or more bank fee transactions<br/>
                  E.g. <span style={{fontFamily: "monospace"}}>Payment for services bf: 35.00 transfer fee bf: 2.45 tax on fee</span></Grid>

        </Grid>
        </Dialog>
    );
}
