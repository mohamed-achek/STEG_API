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

const PaymentCard = ({ payment, onDelete }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6">Amount: ${payment.amount}</Typography>
                <Typography variant="body2">Payment Date: {payment.payment_date}</Typography>
                <Typography variant="body2">Payment Method: {payment.payment_method}</Typography>
                <Typography variant="body2" className={payment.status === 'Paid' ? classes.paid : classes.unpaid}>
                    Status: {payment.status}
                </Typography>
                <Grid container spacing={1} className={classes.button}>
                    <Grid item>
                        <Button variant="contained" color="secondary" onClick={() => onDelete(payment.id)}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

PaymentCard.propTypes = {
    payment: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default PaymentCard;
