import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { Icon } from '../icons/Icon';
import { MoneyFormat, PercentageFormat } from '../common/DecimalFormat';
import history from "../../history";
import {
  Grid,
  Hidden,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import GridRow from '../common/grid/GridRow';
import GridItem from '../common/grid/GridItem';

const styles = theme => ({
  row: {
    "&:hover": {
      cursor: 'pointer',
    },
  },
  gridRow: {
    "&:hover": {
      backgroundColor: theme.palette.gray[1],
    },
  }
})

const goToInvestment = (investment) => {
  history.push('/investment/' + investment.symbol);
}

const useStyles = makeStyles(styles);

function ClickableGridItem({ children, investment, ...other }) {
  const classes = useStyles();
  return (
    <GridItem
      {...other}
      className={classes.row}
      onClick={() => goToInvestment(investment)}
    >
      {children}
    </GridItem>
  )
}

export function InvestmentRow({ investment, onEdit, onDelete, onBuySell, onRecordDividend }) {
  const classes = useStyles();
  const [ anchorEl, setAnchorEl ] = React.useState(null);
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const onBuySellClicked = () => {
    setAnchorEl(null);
    onBuySell();
  }

  const onRecordDividendClicked = () => {
    setAnchorEl(null);
    onRecordDividend();
  }

  const handleCloseMenu = () => {
    setAnchorEl(null);
  }

  return (
    <React.Fragment>
      <GridRow xs={12} spacing={0} className={classes.gridRow}>
        <Hidden smDown>
          <Grid item xs={2}>
            <EditIcon onStartEditing={onEdit} fontSize="small" />
            <Menu
              id="add-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={onBuySellClicked}>Buy/Sell</MenuItem>
              <MenuItem onClick={onRecordDividendClicked}>Record dividend</MenuItem>
            </Menu>
            <DeleteIcon onDelete={onDelete} fontSize="small" />
            <Icon
              onClick={openMenu}
              title="Buy/sell shares in this investment"
              icon={<AddIcon fontSize="small" />}
            />
          </Grid>
        </Hidden>
        <Hidden smDown>
          <ClickableGridItem xs={3} investment={investment}>{investment.name}</ClickableGridItem>
        </Hidden>
        <ClickableGridItem xs={4} md={1} investment={investment}>{investment.symbol}</ClickableGridItem>
        <Hidden smDown>
          <ClickableGridItem xs={1} investment={investment}>{investment.shares}</ClickableGridItem>
        </Hidden>
        <ClickableGridItem xs={4} md={1} investment={investment}>
          <MoneyFormat amount={investment.lastPrice} />
        </ClickableGridItem>
        <Hidden smDown>
          <ClickableGridItem item xs={1} investment={investment}>
            <MoneyFormat amount={investment.averagePrice} />
          </ClickableGridItem>
          <ClickableGridItem xs={1} investment={investment}>
            <PercentageFormat amount={investment.annualizedIrr} />
          </ClickableGridItem>
          <ClickableGridItem xs={1} investment={investment}>
            <MoneyFormat amount={investment.bookValue} />
          </ClickableGridItem>
        </Hidden>
        <ClickableGridItem xs={4} md={1} investment={investment}>
          <MoneyFormat amount={investment.currentValue} />
        </ClickableGridItem>
      </GridRow>
    </React.Fragment>
  );
}