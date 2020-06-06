import React from 'react';
import { useSelector } from 'react-redux';
import { sumBy} from 'lodash';
import { ListItemSecondaryAction } from '@material-ui/core';

export default function NetWorth() {
  const accounts = useSelector(state => state.accounts);

  console.log("NET WORTH");
  const netWorth = sumBy(accounts, a => a.currentBalanceInUsd);
  console.log(accounts);
    return (
      <ListItemSecondaryAction>
        {Number(netWorth).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}
      </ListItemSecondaryAction>
    );

}
