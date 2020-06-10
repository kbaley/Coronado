import React from 'react';
import DeleteAccount from './DeleteAccount';
import * as accountActions from '../../actions/accountActions';
import * as transactionActions from '../../actions/transactionActions';
import { useDispatch, useSelector } from 'react-redux';
import TransactionList from './TransactionList';
import LoadMoreTransactions from './LoadMoreTransactions';
import { find } from 'lodash';
import './Account.css';
import EditAccount from './EditAccount';
import UploadQif from './UploadQif';
import { filter } from "lodash";
import history from "../../history";
import { withRouter } from 'react-router-dom';

function AccountHeader({ account }) {
  return <h1>
    {account ? account.name : ""}
  </h1>
}

function Account({ match }) {

  const accounts = useSelector(state => state.accounts);
  const accountTypes = useSelector(state => state.accountTypes);
  const categories = useSelector(state => state.categories);
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

  const uploadQif = (file, fromDate) => {
    dispatch(accountActions.uploadQif(this.getSelectedAccount().accountId, file, fromDate));

  }

  const account = getSelectedAccount();
  console.log(remainingTransactionCount);

  return (
    <div>
      <div style={{ float: "right", width: "150px" }}>
        <UploadQif account={account} onUpload={uploadQif} />
        <EditAccount account={account} onUpdate={updateAccount} accountTypes={accountTypes} />
        <DeleteAccount onDelete={deleteAccount} />
      </div>
      <AccountHeader account={account} />
      <TransactionList
        mortgageAccounts={getMortgageAccounts()}
        account={account}
        categories={categories}
      />
      {remainingTransactionCount > 0 ? <LoadMoreTransactions /> : null}
    </div>
  );
}

export default withRouter(Account);