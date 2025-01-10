import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, TextField, Grid } from '@material-ui/core';
import MainCard from '../../ui-component/cards/MainCard';

const CheckoutPage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/bills/${id}/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cardNumber, expiryDate, cvv }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            history.push('/billing');
        } catch (error) {
            console.error('Error processing payment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
    );
};

export default CheckoutPage;
