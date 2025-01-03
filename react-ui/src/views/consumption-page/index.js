import React, { useEffect, useState } from 'react';

// material-ui
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, TextField, Button } from '@material-ui/core';

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
    const [inputValues, setInputValues] = useState({ month1: '', month2: '', month3: '' });
    const [prediction, setPrediction] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handlePredict = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ input_data: [inputValues.month1, inputValues.month2, inputValues.month3] })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPrediction(data.prediction[0][0]);
        } catch (error) {
            console.error('Error predicting consumption:', error);
        }
    };

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
                    <Grid item xs={12}>
                        <Typography variant="h6">Enter Consumption Values for the Last 3 Months:</Typography>
                        <TextField
                            label="Month 1"
                            name="month1"
                            value={inputValues.month1}
                            onChange={handleInputChange}
                            style={{ marginRight: '10px' }}
                        />
                        <TextField
                            label="Month 2"
                            name="month2"
                            value={inputValues.month2}
                            onChange={handleInputChange}
                            style={{ marginRight: '10px' }}
                        />
                        <TextField
                            label="Month 3"
                            name="month3"
                            value={inputValues.month3}
                            onChange={handleInputChange}
                            style={{ marginRight: '10px' }}
                        />
                        <Button variant="contained" color="primary" onClick={handlePredict}>
                            Predict Next Month's Consumption
                        </Button>
                    </Grid>
                    {prediction !== null && (
                        <Grid item xs={12}>
                            <Typography variant="h4" style={{ marginTop: '20px' }}>
                                Predicted Consumption for Next Month: <strong>{prediction.toFixed(2)} kWh</strong>
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}
        </MainCard>
    );
};

export default ConsumptionPage;
