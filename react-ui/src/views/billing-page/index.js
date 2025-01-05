import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles'; // Correct import for makeStyles
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';

const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
    },
    cardContent: {
        padding: theme.spacing(2),
    },
    cardActions: {
        justifyContent: 'flex-end',
        padding: theme.spacing(1),
    },
    paidStatus: {
        fontWeight: 'bold',
    },
    paidYes: {
        color: theme.palette.success.main,
    },
    paidNo: {
        color: theme.palette.error.main,
    },
}));

const BillingPage = () => {
    const classes = useStyles();
    const [bills, setBills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/bills');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBills(data);
            } catch (error) {
                console.error('Error fetching bills:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBills();
    }, []);

    return (
        <MainCard title="Billing">
            {isLoading ? (
                <Typography variant="body2">Loading...</Typography>
            ) : (
                <Grid container spacing={gridSpacing}>
                    {bills && bills.length > 0 ? (
                        bills.map((bill) => (
                            <Grid item xs={12} sm={6} md={4} key={bill.id}>
                                <Card className={classes.card}>
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="h6">Bill ID: {bill.id}</Typography>
                                        <Typography variant="body2">User ID: {bill.user_id}</Typography>
                                        <Typography variant="body2">Amount: ${bill.amount}</Typography>
                                        <Typography variant="body2">Due Date: {bill.due_date}</Typography>
                                        <Typography
                                            variant="body2"
                                            className={`${classes.paidStatus} ${bill.paid ? classes.paidYes : classes.paidNo}`}
                                        >
                                            Paid: {bill.paid ? 'Yes' : 'No'}
                                        </Typography>
                                        <Typography variant="body2">Payment Date: {bill.payment_date || 'N/A'}</Typography>
                                    </CardContent>
                                    <CardActions className={classes.cardActions}>
                                        <Button size="small" color="primary">View Details</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body2" align="center">No bills found.</Typography>
                        </Grid>
                    )}
                </Grid>
            )}
        </MainCard>
    );
};

export default BillingPage;
