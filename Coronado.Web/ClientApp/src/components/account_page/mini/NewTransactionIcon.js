import React from 'react';
import { NewIcon } from '../../icons/NewIcon';

const showForm = () => {

}

export default function NewTransactionIcon(props) {

  return (
    <React.Fragment>
        <NewIcon onClick={showForm} />
    </React.Fragment>
  )
}
