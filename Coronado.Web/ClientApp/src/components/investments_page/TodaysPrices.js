import React from 'react';
import Moment from 'react-moment';
import { Icon } from "../icons/Icon";
import {
  withStyles, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, InputBase, Table, TableHead, TableRow, TableBody, TableCell
} from '@material-ui/core'
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

export default function TodaysPrices(props) {
  const [investments, setInvestments] = React.useState([]);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {

    if (props.investments && props.investments.length > 0
      && props.investments.length !== investments.length) {
      setInvestments(
        props.investments.map(i => {
          return {
            investmentId: i.investmentId,
            name: i.name,
            symbol: i.symbol,
            lastPriceDate: i.lastPriceRetrievalDate,
            lastPrice: i.lastPrice
          }
        })

      );
    };
  }, [props.investments, investments.length]);

  const showTodaysPrices = () => {
    setShow(true);
    return false;
  }

  const savePrices = () => {
    props.onSave(investments);
    setInvestments([]);
    setShow(false);
  }

  const handleChangePrice = (investmentIndex, e) => {
    let newState = [...investments];
    newState[investmentIndex].lastPrice = e.target.value;
    setInvestments(newState);
  }

  const handleClose = () => {
    setShow(false);
  }

  return (
    <span>

      <Icon
        onClick={showTodaysPrices}
        title="Update todays prices"
        icon={<LocalOfferIcon />}
      />
      <Dialog
        onClose={handleClose}
        open={show}
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
              {investments && investments.map((i, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{i.symbol}</TableCell>
                    <TableCell><Moment format="M/D/YYYY">{i.lastPriceRetrievalDate}</Moment></TableCell>
                    <TableCell>
                      <PriceInput
                        defaultValue={i.lastPrice}
                        onChange={(e) => handleChangePrice(index, e)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={savePrices} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
