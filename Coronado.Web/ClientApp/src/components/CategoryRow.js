import React from 'react';
import { DeleteIcon } from './icons/DeleteIcon';
import { EditIcon } from './icons/EditIcon';

export function CategoryRow({category, onEdit, onDelete, parent}) {
  return (
    <tr>
      <td>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
      </td>
      <td>{category.name}</td>
      <td>{category.type}</td>
      <td>{parent}</td>
    </tr>
  );
}