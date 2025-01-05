import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// material-ui
import { Typography, Grid, Button } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant'; // Import gridSpacing
import PaymentCard from './PaymentCard'; // Import PaymentCard

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

// Function to generate PDF receipt
const generatePDFReceipt = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('en-US');

    doc.setFontSize(18);
    doc.text('Receipt', 20, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 20, 30);

    doc.setFontSize(14);
    doc.text('Customer Information:', 20, 40);
    doc.setFontSize(12);
    doc.text('Name: John Doe', 20, 50);
    doc.text('Email: john.doe@example.com', 20, 60);

    doc.setFontSize(14);
    doc.text('Itemized List:', 20, 70);
    doc.setFontSize(12);
    const items = [
        { name: 'Item 1', price: 10 },
        { name: 'Item 2', price: 20 },
        { name: 'Item 3', price: 30 },
    ];
    let yPosition = 80;
    let total = 0;
    items.forEach((item) => {
        doc.text(`${item.name}: $${item.price}`, 20, yPosition);
        yPosition += 10;
        total += item.price;
    });

    doc.setFontSize(14);
    doc.text(`Total: $${total}`, 20, yPosition + 10);

    doc.setFontSize(12);
    doc.text('Thank you for your purchase!', 20, yPosition + 30);

    doc.save('receipt.pdf');
};

// Function to generate payment receipt with jsPDF and jsPDF-autotable
const generatePaymentReceipt = (payment) => {
    const doc = new jsPDF();

    // Add Logo (Placeholder)
    const logoUrl = 'path_to_logo.png'; // Replace with the actual path to the logo
    doc.addImage(logoUrl, 'PNG', 20, 10, 50, 20); // Position (20, 10) with width 50 and height 20

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
                            <PaymentCard payment={payment} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </MainCard>
    );
};

export default PaymentPage;
