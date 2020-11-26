import { InputBase } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export const TransactionInput = withStyles((theme) => ({
  input: {
    padding: ".2em .3em",
    borderRadius: ".4em",
    borderWidth: 2,
    margin: "0 6px 0 0",
    borderStyle: "solid",
    borderColor: theme.palette.blue,
    fontSize: 13,
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  },

}))(InputBase);

