import React from 'react';
import NewTransactionIcon from './NewTransactionIcon';
import MiniTransactionList from './MiniTransactionList';
import { useSelector } from 'react-redux';
import { filter } from 'lodash';

export default function MiniAccountPage({account}) {
  const categories = useSelector(state => state.categories);
  const accounts = useSelector(state => state.accounts);

  const getMortgageAccounts = () => {
    return filter(accounts, a => a.accountType === "Mortgage");
  }

  return (
    <React.Fragment>
      <div style={{ float: "right", width: "50px" }}>
        <NewTransactionIcon />
      </div>
      <h1 style={{ "float": "left" }}>
        {account ? account.name : ""}
      </h1>
      <MiniTransactionList
        mortgageAccounts={getMortgageAccounts()}
        account={account}
        categories={categories}
      />
    </React.Fragment>
  );
}