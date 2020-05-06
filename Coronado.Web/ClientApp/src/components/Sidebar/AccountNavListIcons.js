import CreditCardIcon from '@material-ui/icons/CreditCard';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import HouseIcon from '@material-ui/icons/House';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import MoneyIcon from '@material-ui/icons/Money';

export default function getIcon(accountType) {
  switch (accountType) {
    case "Credit Card":
      return CreditCardIcon;
    case "Asset":
      return DirectionsCarIcon;
    case "Mortgage":
      return HouseIcon;
    case "Investment":
      return AttachMoneyIcon;
    case "Loan":
      return MoneyIcon;
    case "Cash":
      return AccountBalanceWalletIcon;
    default:
      return AccountBalanceIcon;
  }
}
