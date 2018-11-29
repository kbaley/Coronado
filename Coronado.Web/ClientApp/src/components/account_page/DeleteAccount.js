import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import './DeleteAccount.css';

export default function DeleteAccount(props) {
    return (
      <span>
        <DeleteIcon onDelete={props.onDelete} className="delete-account"/>
      </span>
    );
}

