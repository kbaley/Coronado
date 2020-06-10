import React, { Component } from 'react';
import Moment from 'react-moment';
import { Icon } from "../icons/Icon";
import { withStyles, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, InputBase, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core'
import { fade } from '@material-ui/core/styles';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

const PriceInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    width: '100px',
    padding: '5px 12px',
    textAlign: 'right',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  }
}))(InputBase);

class TodaysPrices extends Component {
  displayName = TodaysPrices.name;
  constructor(props) {
    super(props);
    this.savePrices = this.savePrices.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.showTodaysPrices = this.showTodaysPrices.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      investments: [],
      show: false
    };
  }

  componentDidUpdate() {
    if (this.props.investments && this.props.investments.length > 0
      && this.props.investments.length !== this.state.investments.length) {
      this.setState({
        investments: this.props.investments.map(i => {
          return {
            investmentId: i.investmentId,
            name: i.name,
            symbol: i.symbol,
            lastPriceDate: i.lastPriceRetrievalDate,
            lastPrice: i.lastPrice
          }
        })
      })
    };

  }

  showTodaysPrices() {
    this.setState({ show: true });
    return false;
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.savePrices();
    }
  }

  savePrices() {
    this.props.onSave(this.state.investments);
    this.setState({
      investments: [],
      show: false
    });
  }

  handleChangePrice(investmentIndex, e) {
    let investments = [...this.state.investments];
    investments[investmentIndex].lastPrice = e.target.value;

    this.setState({
      investments
    });
  }

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    return (
      <span>

        <Icon 
          onClick={this.showTodaysPrices} 
          title="Update todays prices" 
          icon={<LocalOfferIcon />}
        />
        <Dialog
          onClose={this.handleClose}
          open={this.state.show}
        >
          <DialogTitle>Today's Prices</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Investment</TableCell>
                  <TableCell>Last Price Date</TableCell>
                  <TableCell align={'right'}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {this.state.investments && this.state.investments.map((i, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{i.symbol}</TableCell>
                    <TableCell><Moment format="M/D/YYYY">{i.lastPriceDate}</Moment></TableCell>
                    <TableCell>
                      <PriceInput
                        defaultValue={i.lastPrice}
                        onChange={(e) => this.handleChangePrice(index, e)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.savePrices} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </span>
    );
  };
}

export default TodaysPrices;
