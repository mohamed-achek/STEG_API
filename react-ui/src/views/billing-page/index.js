import React, { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant'; // Import gridSpacing
import BillCard from './BillCard'; // Import BillCard component

// Hook to fetch billing data
const useFetchBillingData = () => {
    const [billingData, setBillingData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/bills');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched billing data:', data); // Log the fetched data
                setBillingData(data.bills);
            } catch (error) {
                console.error('Error fetching billing data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBillingData();
    }, []);

    return { billingData, isLoading };
};

//==============================|| BILLING PAGE ||==============================//

const BillingPage = () => {
    const { billingData, isLoading } = useFetchBillingData();

    const handlePay = (billId) => {
        console.log(`Pay bill with ID: ${billId}`);
        // Implement the logic to pay the bill
    };

    const handleDelete = (billId) => {
        console.log(`Delete bill with ID: ${billId}`);
        // Implement the logic to delete the bill
    };

    return (
        <MainCard title="Bills">
            {isLoading ? (
                <Typography variant="body2">Loading...</Typography>
            ) : (
                <Grid container spacing={gridSpacing}>
                    {billingData.map((bill) => (
                        <Grid item xs={12} sm={6} md={4} key={bill.id}>
                            <BillCard bill={bill} onPay={handlePay} onDelete={handleDelete} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </MainCard>
    );
};

export default BillingPage;
