import React, { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid, Button } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant'; // Import gridSpacing

// Hook to fetch payment data
const useFetchPaymentData = () => {
    const [paymentData, setPaymentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/payments');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched payment data:', data); // Log the fetched data
                setPaymentData(data.payments);
            } catch (error) {
                console.error('Error fetching payment data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentData();
    }, []);

    return { paymentData, isLoading };
};

// Function to download receipt
const downloadReceipt = async (paymentId) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/payments/receipt/${paymentId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${paymentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error('Error downloading receipt:', error);
    }
};

//==============================|| PAYMENT PAGE ||==============================//

const PaymentPage = () => {
    const { paymentData, isLoading } = useFetchPaymentData();

    return (
        <MainCard title="Payments">
            {isLoading ? (
                <Typography variant="body2">Loading...</Typography>
            ) : (
                <Grid container spacing={gridSpacing}>
                    {paymentData.map((payment) => (
                        <Grid item xs={12} key={payment.id}>
                            <Typography variant="h6">Amount: ${payment.amount}</Typography>
                            <Typography variant="body2">Payment Date: {payment.payment_date}</Typography>
                            <Typography variant="body2">Payment Method: {payment.payment_method}</Typography>
                            <Typography variant="body2" style={{ color: 'green', fontWeight: 'bold' }}>
                                Status: {payment.status}
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => downloadReceipt(payment.id)}>
                                Download Receipt
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            )}
        </MainCard>
    );
};

export default PaymentPage;
