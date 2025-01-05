import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles'; // Correct import for makeStyles
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import BillCard from './BillCard'; // Import BillCard component

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

    const handlePay = (id) => {
        // Implement the pay functionality
        console.log(`Pay bill with ID: ${id}`);
    };

    const handleDownload = async (id) => {
        // Implement the download functionality
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/bills/${id}/download`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bill_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error downloading bill:', error);
        }
    };

    const handleDelete = (id) => {
        // Implement the delete functionality
        console.log(`Delete bill with ID: ${id}`);
    };

    return (
        <MainCard title="Billing">
            {isLoading ? (
                <Typography variant="body2">Loading...</Typography>
            ) : (
                <Grid container spacing={gridSpacing}>
                    {bills && bills.length > 0 ? (
                        bills.map((bill) => (
                            <Grid item xs={12} sm={6} md={4} key={bill.id}>
                                <BillCard bill={bill} onPay={handlePay} onDownload={handleDownload} onDelete={handleDelete} />
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
