import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Grid, Modal, Box, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MainCard from '../../ui-component/cards/MainCard';

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
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const BillCard = ({ bill, onDownload }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/bills/${bill.id}/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cardNumber, expiryDate, cvv }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            handleClose();
            // Optionally, you can update the bill status in the parent component
        } catch (error) {
            console.error('Error processing payment:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                        <Button variant="contained" color="primary" onClick={handleOpen} disabled={bill.paid}>
                            Pay Now
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => onDownload(bill.id)}>
                            Download
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
            <Modal
                open={open}
                onClose={handleClose}
                className={classes.modal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box className={classes.paper}>
                    <MainCard title="Payment">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Card Number"
                                    fullWidth
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Expiry Date"
                                    fullWidth
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="CVV"
                                    fullWidth
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlePayment}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Processing...' : 'Pay Now'}
                                </Button>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Box>
            </Modal>
        </Card>
    );
};

BillCard.propTypes = {
    bill: PropTypes.object.isRequired,
    onDownload: PropTypes.func.isRequired,
};

export default BillCard;
