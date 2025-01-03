import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Card, CardContent, Typography, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

// style constant
const useStyles = makeStyles((theme) => ({
    card: {
        marginBottom: theme.spacing(2),
    },
    paid: {
        color: 'green',
    },
    unpaid: {
        color: 'red',
    },
    button: {
        marginTop: theme.spacing(1),
    },
}));

const BillCard = ({ bill, onPay, onDelete }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6">Amount: ${bill.amount}</Typography>
                <Typography variant="body2">Due Date: {bill.due_date}</Typography>
                <Typography variant="body2" className={bill.paid ? classes.paid : classes.unpaid}>
                    Status: {bill.paid ? 'Paid' : 'Unpaid'}
                </Typography>
                <Typography variant="body2">Payment Date: {bill.payment_date || 'N/A'}</Typography>
                <Grid container spacing={1} className={classes.button}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => onPay(bill.id)}>
                            Pay Now
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" onClick={() => onDelete(bill.id)}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

BillCard.propTypes = {
    bill: PropTypes.object.isRequired,
    onPay: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default BillCard;
