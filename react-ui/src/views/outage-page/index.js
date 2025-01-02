import React, { useEffect, useState } from 'react';
import {GoogleMap,HeatmapLayer,useJsApiLoader} from "@react-google-maps/api";

// material-ui
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';

// Hook to fetch outage data
const useFetchOutageData = () => {
    const [outageData, setOutageData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOutageData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/outages');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched outage data:', data); // Log the fetched data
                setOutageData(data);
            } catch (error) {
                console.error('Error fetching outage data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOutageData();
    }, []);

    return { outageData, isLoading };
};

//==============================|| OUTAGE PAGE ||==============================//

const OutagePage = () => {
    const { outageData, isLoading } = useFetchOutageData();

    return (
        <MainCard title="Outages">
            {isLoading ? (
                <Typography variant="body2">Loading...</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Outage Type</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {outageData.map((outage) => (
                                <TableRow key={outage.id}>
                                    <TableCell>{outage.id}</TableCell>
                                    <TableCell>{outage.outage_type}</TableCell>
                                    <TableCell>{outage.start_time}</TableCell>
                                    <TableCell>{outage.end_time || 'N/A'}</TableCell>
                                    <TableCell>{outage.description}</TableCell>
                                    <TableCell>{outage.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </MainCard>
    );
};

export default OutagePage;
