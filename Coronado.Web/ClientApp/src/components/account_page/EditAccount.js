import React, { Fragment } from 'react';
import { AccountForm } from './AccountForm';
import { EditIcon } from '../icons/EditIcon';
import './EditAccount.css';

export default function EditAccount({account, onUpdate, accountTypes}) {
  const [ show, setShow ] = React.useState(false);

  const showForm = () => {
    setShow(true);
  }
  const hideForm = () => {
    setShow(false);
  }
    return (
    <Fragment>
      <EditIcon className="edit-account" onStartEditing={showForm} />
      <AccountForm 
        show={show} 
        onClose={hideForm} 
        account={account} 
        onSave={onUpdate}
        accountTypes={accountTypes}
      />
    </Fragment>
    );
}