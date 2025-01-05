import React from 'react';
import PropTypes from 'prop-types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

// Function to generate payment receipt with jsPDF and jsPDF-autotable
const generatePaymentReceipt = (payment) => {
    const doc = new jsPDF();

    // Add Logo (Placeholder)
    //const logoUrl = 'react-ui/src/assets/images/logo.png'; // Replace with the actual path to the logo
    //doc.addImage(logoUrl, 'PNG', 20, 10, 50, 20); // Position (20, 10) with width 50 and height 20

    // Add Title
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255); // Blue color for title
    doc.text('Payment Receipt', 85, 40);

    // Add Date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color for date
    doc.text(`Date: ${date}`, 20, 50);

    // Payment Data (from clicked payment)
    const { id, user_id, bill_id, amount, payment_date, payment_method, status } = payment;

    // Define Table Data
    const columns = ["ID", "User ID", "Bill ID", "Amount", "Payment Date", "Payment Method", "Status"];
    const data = [
        [id, user_id, bill_id, `$${amount.toFixed(2)}`, payment_date, payment_method, status]
    ];

    // Add Table
    doc.autoTable(columns, data, {
        startY: 60, // Start table below the title
        theme: 'grid', // Use grid theme for the table
        headStyles: { fillColor: [0, 0, 255] }, // Blue header background
        bodyStyles: { textColor: [0, 0, 0] }, // Black text color for body
        styles: { fontSize: 12, cellPadding: 5 }, // Table cell padding and font size
        margin: { top: 10, left: 20, right: 20 }, // Margins around the table
    });

    // Add Footer
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black color for footer text
    doc.text('Thank you for using STEG services!', 20, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save(`payment_receipt_${id}.pdf`);
};

const PaymentCard = ({ payment }) => {
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
                        <Button variant="contained" color="primary" onClick={() => generatePaymentReceipt(payment)}>
                            Generate PDF Receipt
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

PaymentCard.propTypes = {
    payment: PropTypes.object.isRequired,
};

export default PaymentCard;
