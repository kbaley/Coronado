import React from 'react';
import { NewIcon } from '../../icons/NewIcon';

export default function NewTransactionIcon({onClick}) {

  return (
    <React.Fragment>
        <NewIcon onClick={onClick} />
    </React.Fragment>
  )
}
