import React from 'react';
import NewTransactionIcon from './NewTransactionIcon';
import MiniTransactionList from './MiniTransactionList';
import { useSelector } from 'react-redux';
import EditTransaction from './EditTransaction';

export default function MiniAccountPage({account}) {
  const [ isEditing, setIsEditing ] = React.useState(true);
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
      />
      }
      { !isEditing &&
      <MiniTransactionList
        account={account}
        categories={categories}
      />
      }
    </React.Fragment>
  );
}