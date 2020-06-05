import React from 'react';
import { useSelector } from 'react-redux';
import { sumBy} from 'lodash';
import { ListItemSecondaryAction } from '@material-ui/core';

export default function NetWorth() {
  const accounts = useSelector(state => state.accounts);
  const currencies = useSelector(state => state.currencies);

  const getCurrentBalance = (account) => {
    if (account.currency === "USD") return account.currentBalance;
    if (!currencies.CAD) return account.currentBalance;
    return (account.currentBalance / currencies.CAD);
  }
  const netWorth = sumBy(accounts, getCurrentBalance);
    return (
      <ListItemSecondaryAction>
        {Number(netWorth).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}
      </ListItemSecondaryAction>
    );

}
