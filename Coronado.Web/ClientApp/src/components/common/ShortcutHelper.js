import React, { Component } from 'react';
import * as Mousetrap from 'mousetrap';
import './ShortcutHelper.css';
import routes from '../../routes';
import { withRouter } from 'react-router-dom';
import { withStyles, Dialog, DialogTitle, TableContainer, Paper, Table, TableBody, TableRow, TableCell } from '@material-ui/core';

const styles = theme => ({
})

class ShortcutHelper extends Component {
  constructor(props) {
    super(props);
    this.showHelp = this.showHelp.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = { show: false };
  }
  componentDidMount() {
    
    Mousetrap.bind('?', this.showHelp);
    routes.filter(r => r.shortcut).map(route => {
      return Mousetrap.bind(route.shortcut, () => {
        this.props.history.push(route.path);
      });
    });
  }
  showHelp() {
    this.setState({ show: true });
  }
  handleClose() {
    this.setState({ show: false });
  }
  render() {
    const { classes } = this.props;

    return (
      <Dialog onClose={this.handleClose}
        open={this.state.show}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>Shortcuts</DialogTitle>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell>g [1-9]</TableCell>
                <TableCell>Go to account</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>n a</TableCell>
                <TableCell>New account</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>n t</TableCell>
                <TableCell>(On an account listing) New transaction</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>g d</TableCell>
                <TableCell>Go to the dashboard</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>g i</TableCell>
                <TableCell>Go to the investments page</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>g r</TableCell>
                <TableCell>Go to the reports page</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>g n</TableCell>
                <TableCell>Go to the invoices page</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>n i</TableCell>
                <TableCell>(On the invoices page) Create a new invoice</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>n c</TableCell>
                <TableCell>(On the categories page) Create a new category</TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Include <span style={{fontFamily: "monospace"}}>
                  bf: &lt;amount&gt; &lt;bank fee description&gt;</span> in a transaction description to 
                  automatically add one or more bank fee transactions<br/>
                  E.g. <span style={{fontFamily: "monospace"}}>Payment for services bf: 35.00 transfer fee bf: 2.45 tax on fee</span></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    );
  }
}

export default withRouter((withStyles(styles)(ShortcutHelper)));