import React from 'react';
import * as accountActions from '../../actions/accountActions'
import { useDispatch, useSelector } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { AccountForm } from './AccountForm';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Button, makeStyles } from '@material-ui/core';

const styles = theme => ({
  newAccount: {
    margin: "5px 5px 5px 15px"
  },
  button: {
    backgroundColor: theme.palette.green
  }
});

const useStyles = makeStyles(styles);

export default function NewAccount() {
  const [show, setShow] = React.useState(false);
  const accountTypes = useSelector(state => state.accountTypes);
  const dispatch = useDispatch();

  React.useEffect(() => {
    Mousetrap.bind('n a', newAccount);
    return function cleanup() {
      Mousetrap.unbind('n a');
    }
  });

  const newAccount = () => {
    setShow(true);
    return false;
  }

  const handleClose = () => {
    setShow(false);
  }

  const saveNewAccount = (account) => {
    dispatch(accountActions.createAccount(account));
  }

  const classes = useStyles();

  return (
    <div className={classes.newAccount}>
      <Button onClick={newAccount} className={classes.button} size="small">
        <AddCircleIcon />
        <span style={{ "marginLeft": "5px" }}>New Account</span>
      </Button>
      <AccountForm show={show} onClose={handleClose}
        onSave={saveNewAccount} accountTypes={accountTypes} />
    </div>
  );
}
