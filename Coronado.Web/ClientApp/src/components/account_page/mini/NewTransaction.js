import React from 'react';
import { NewIcon } from '../../icons/NewIcon';

const showForm = () => {

}

export default function NewTransaction(props) {

  return (
    <React.Fragment>
        <NewIcon onClick={showForm} />
    </React.Fragment>
  )
}
