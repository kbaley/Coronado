import React from 'react';
import { useSelector } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { MoneyFormat } from '../common/DecimalFormat';
import Spinner from '../common/Spinner';
import { filter } from 'lodash';
import { SidebarMenuItem } from './SidebarMenuItem';
import NewAccount from '../account_page/NewAccount';
import ToggleAllAccounts from './ToggleAllAccounts';
import { Toolbar, List } from '@material-ui/core';
import getIcon from './AccountNavListIcons';
import history from '../../history';
import { makeStyles } from '@material-ui/core/styles';

const styles = ({

});

const useStyles = makeStyles(styles);

export default function AccountNavList() {
  const [isLoading, setIsLoading] = React.useState(true);
  const accounts = useSelector(state => state.showAllAccounts ? state.accounts : filter(state.accounts, a => !a.isHidden));
  const isLoadingData = useSelector(state => state.loading ? state.loading.accounts : true);

  React.useEffect(() => {

    function goToAccount(e) {
      var key = parseInt(e.key, 10) - 1;
      history.push('/account/' + accounts[key].accountId);
    }

    if (isLoading && accounts && accounts.length > 0) {
      for (var i = 0; i < accounts.length; i++) {
        if (i < 10) {
          Mousetrap.bind('g ' + (i+1), goToAccount);
        }
      }
      setIsLoading(false);
    }

    // No cleanup function here to unbind the mousetrap bindings
    // because it runs on each render change, so it will "cleanup"
    // the bindings but due to the logic of setting the bindings
    // they will never get reinstated. This is okay because the
    // navlist is always visible
  }, [isLoading, accounts]);

  const pathname = history.location.pathname;
  const classes = useStyles();
  return (
    <List className={classes.list}>
      <Toolbar disableGutters={true} className={classes.toolbar} >
        <NewAccount />
        <ToggleAllAccounts />
      </Toolbar>
      {isLoadingData ? <Spinner /> :
        accounts.map((account, index) => (
          <SidebarMenuItem
            key={index}
            to={'/account/' + account.accountId}
            selected={'/account/' + account.accountId === pathname}
            primary={account.name}
            secondary={<MoneyFormat amount={account.currentBalance} />}
            icon={getIcon(account.accountType)} />
        ))}
    </List>
  );
}
