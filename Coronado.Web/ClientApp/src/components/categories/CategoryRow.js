import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { CustomTableRow } from '../common/Table';

export function CategoryRow({category, onEdit, onDelete, parent}) {
  return (
    <CustomTableRow
      tableData={[category.name, category.type, parent]}
      key={category.categoryId}
    >
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
    </CustomTableRow>
  );
}