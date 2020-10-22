import React from 'react';
import NewTransactionIcon from './NewTransactionIcon';
import MiniTransactionList from './MiniTransactionList';
import { useSelector } from 'react-redux';
import EditTransaction from './EditTransaction';
import {
  SwipeableList,
} from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';

export default function MiniAccountPage({ account }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const categories = useSelector(state => state.categories);

  return (
    <React.Fragment>
      <div style={{ float: "right", width: "50px" }}>
        <NewTransactionIcon
          onClick={() => setIsEditing(true)}
        />
      </div>
      <h1 style={{ "float": "left" }}>
        {account ? account.name : ""}
      </h1>
      { isEditing &&
        <EditTransaction
          account={account}
          onCancel={() => setIsEditing(false)}
          onSave={(() => setIsEditing(false))}
        />
      }
      { !isEditing &&
        <SwipeableList
          threshold={0.25}>
          <MiniTransactionList
            account={account}
            categories={categories}
          />
        </SwipeableList>
      }
    </React.Fragment>
  );
}