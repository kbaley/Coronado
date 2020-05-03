import Home from './components/Home';
import Account from './components/account_page/Account';
import Categories from './components/categories/Categories';
import InvoicesPage from './components/invoices/InvoicesPage';
import LoginPage from './components/LoginPage';
import CustomersPage from './components/customers/CustomersPage';
import ReportsPage from "./components/reports_page/ReportsPage";
import InvestmentsPage from "./components/investments_page/InvestmentsPage";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LabelIcon from '@material-ui/icons/Label';
import PeopleIcon from '@material-ui/icons/People';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';

const routes = [
  {
    name: 'Login',
    path: '/login',
    component: LoginPage,
    isPublic: true
  },
  {
    name: 'Categories',
    path: '/categories',
    component: Categories,
    isTopLevelMenu: true,
    icon: LabelIcon,
  },
  {
    name: 'Invoices',
    path: '/invoices',
    component: InvoicesPage,
    isTopLevelMenu: true,
    icon: ListAltIcon,
    shortcut: 'g n',
  },
  {
    name: 'Customers',
    path: '/customers',
    component: CustomersPage,
    isTopLevelMenu: true,
    icon: PeopleIcon,
  },
  {
    name: 'Reports',
    path: '/reports',
    component: ReportsPage,
    isTopLevelMenu: true,
    icon: TrendingUpIcon,
    shortcut: 'g r',
  },
  {
    name: 'Investments',
    path: '/investments',
    component: InvestmentsPage,
    icon: LocalAtmIcon,
    isTopBar: true,
    shortcut: 'g i',
  },
  {
    name: 'Account',
    path: '/account/:accountId',
    component: Account
  },
  {
    name: 'Dashboard',
    path: '/',
    component: Home,
    shortcut: 'g d',
  },
]

export default routes;