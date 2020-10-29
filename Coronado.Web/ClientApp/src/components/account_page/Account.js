import React from 'react';
import DeleteAccount from './DeleteAccount';
import * as accountActions from '../../actions/accountActions';
import * as transactionActions from '../../actions/transactionActions';
import { useDispatch, useSelector } from 'react-redux';
import TransactionList from './TransactionList';
import LoadMoreTransactions from './LoadMoreTransactions';
import { find, filter } from 'lodash';
import EditAccount from './EditAccount';
import UploadQif from './UploadQif';
import history from "../../history";
import { withRouter } from 'react-router-dom';
import { Box } from '@material-ui/core';
import MiniAccountPage from './mini/MiniAccountPage';

function AccountHeader({ account }) {
  return <h1 style={{"float": "left"}}>
    {account ? account.name : ""}
  </h1>
}

function Account({ match }) {

  const accounts = useSelector(state => state.accounts);
  const accountTypes = useSelector(state => state.accountTypes);
  const remainingTransactionCount = useSelector(state => state.transactionModel.remainingTransactionCount);
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(transactionActions.loadTransactions(match.params.accountId));
  }, [dispatch, match.params.accountId])

  const deleteAccount = () => {
    var account = getSelectedAccount();
    dispatch(accountActions.deleteAccount(account.accountId, account.name));
    if (accounts.length === 0) {
      history.push('/');
    } else if (accounts[0].accountId === account.accountId) {
      history.push('/account/' + accounts[1].accountId);
    } else {
      history.push('/account/' + accounts[0].accountId);
    }
  }

  const updateAccount = (account) => {
    dispatch(accountActions.updateAccount(account));
  }

  const getSelectedAccount = () => {
    if (!accounts) return { name: '', transactions: [] }
    const account = find(accounts, (a) => { return a.accountId === match.params.accountId });
    if (!account) return { name: '', transactions: [] }
    return account;
  }

  const getMortgageAccounts = () => {
    return filter(accounts, a => a.accountType === "Mortgage");
  }

  const uploadQif = (file, fromDate, transactions) => {
    dispatch(accountActions.uploadQif(getSelectedAccount().accountId, file, fromDate, transactions));

  }

  const account = getSelectedAccount();

  return (
    <div>
      <Box display={{ xs: "none", md: "block" }}>
        <div style={{ float: "right", width: "150px" }}>
          <UploadQif account={account} onUpload={uploadQif} />
          <EditAccount account={account} onUpdate={updateAccount} accountTypes={accountTypes} />
          <DeleteAccount onDelete={deleteAccount} />
        </div>
        <AccountHeader account={account} />
        <TransactionList
          mortgageAccounts={getMortgageAccounts()}
          account={account}
        />
        {remainingTransactionCount > 0 ? <LoadMoreTransactions /> : null}
      </Box>
      <Box display={{ xs: "block", md: "none" }}>
        <MiniAccountPage 
          account={account}
        />
      </Box>
    </div>
  );
}

export default withRouter(Account);