import React from 'react';
import './InvoiceLineItems.css';
import { CurrencyFormat } from "../common/CurrencyFormat";

const InvoiceLineItems = ({ lineItems, onLineItemChanged }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantity</th>
          <th>Unit Cost</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map((li, index) =>
          <tr key={index}>
            <td>
              <input type="text"
                name="description"
                value={li.description}
                onChange={(e) => onLineItemChanged(index, e.target.name, e.target.value)} />
            </td>
            <td>
              <input type="text"
                name="quantity"
                value={li.quantity}
                onChange={(e) => onLineItemChanged(index, e.target.name, e.target.value)} />
            </td>
            <td>
              <input type="text"
                name="unitAmount"
                value={li.unitAmount}
                onChange={(e) => onLineItemChanged(index, e.target.name, e.target.value)} />
            </td>
            <td><CurrencyFormat value={li.quantity && li.unitAmount ? (li.quantity * li.unitAmount ) : 0} /></td>
            <td></td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default InvoiceLineItems;