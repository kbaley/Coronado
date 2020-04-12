import store from "../../index";
import { sumBy } from 'lodash';

export function getInvestmentsTotal() {
  if (!store) return 0.00;

  const investments = store.getState().investments; 
  const currencies = store.getState().currencies;
  return sumBy(investments, i => {
    if (i.currency === 'CAD') {
      return (parseFloat(i.currentValue)) / currencies['CAD'];
    } else {
      return (parseFloat(i.currentValue));
    }
  }).toFixed(2);
}