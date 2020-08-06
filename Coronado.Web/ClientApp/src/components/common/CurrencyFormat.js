import React from 'react';
import { makeStyles } from '@material-ui/core';

const styles = () => ({
    currency: {
        width: "100%",
        textAlign: "right",
        padding: "0 5px 0",
        display: "inline-block",
    }
})

const useStyles = makeStyles(styles);
export function CurrencyFormat({ value }) {
    if (isNaN(value)) {
        value = 0;
    }
    const classes = useStyles();
    return (
        <span className={classes.currency}>
            {Currency(value)}
        </span>
    );
}

export function Currency(value) {
    return (
        Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
    );
}

