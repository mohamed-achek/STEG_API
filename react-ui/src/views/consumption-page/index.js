import React, { useEffect, useState } from 'react';

// material-ui
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant'; // Import gridSpacing

// Hook to fetch consumption data
const useFetchConsumptionData = () => {
    const [consumptionData, setConsumptionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConsumptionData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/consumption');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched consumption data:', data); // Log the fetched data
                setConsumptionData(data);
            } catch (error) {
                console.error('Error fetching consumption data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConsumptionData();
    }, []);

    return { consumptionData, isLoading };
};

//==============================|| CONSUMPTION PAGE ||==============================//

const ConsumptionPage = () => {
    const { consumptionData, isLoading } = useFetchConsumptionData();

    return (
        <MainCard title="Consumption">
            {isLoading ? (
                <Typography variant="body2">Loading...</Typography>
            ) : (
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>User ID</TableCell>
                                        <TableCell>Consumption (kWh)</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {consumptionData.map((consumption) => (
                                        <TableRow key={consumption.id}>
                                            <TableCell>{consumption.id}</TableCell>
                                            <TableCell>{consumption.user_id}</TableCell>
                                            <TableCell>{consumption.consumption}</TableCell>
                                            <TableCell>{consumption.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            )}
        </MainCard>
    );
};

export default ConsumptionPage;
