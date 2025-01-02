import React, { useEffect, useState } from 'react';
import { GoogleMap, HeatmapLayer, LoadScript } from '@react-google-maps/api';

// material-ui
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant'; // Import gridSpacing

// Hook to fetch outage data
const useFetchOutageData = () => {
    const [outageData, setOutageData] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
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

        const fetchHeatmapData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/outages/heatmap');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched heatmap data:', data); // Log the fetched data
                setHeatmapData(data);
            } catch (error) {
                console.error('Error fetching heatmap data:', error);
            }
        };

        fetchOutageData();
        fetchHeatmapData();
    }, []);

    return { outageData, heatmapData, isLoading };
};

//==============================|| OUTAGE PAGE ||==============================//

const OutagePage = () => {
    const { outageData, heatmapData, isLoading } = useFetchOutageData();
    const [heatmapPoints, setHeatmapPoints] = useState([]);

    const handleLoad = () => {
        const points = heatmapData.map(data => ({
            location: new window.google.maps.LatLng(data.latitude, data.longitude),
            weight: data.weight
        }));
        setHeatmapPoints(points);
    };

    return (
        <MainCard title="Outages">
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
                    </Grid>
                    <Grid item xs={12}>
                        <LoadScript
                            googleMapsApiKey="" // Add your Google Maps API key here
                            libraries={['visualization']}
                            onLoad={handleLoad}
                        >
                            <GoogleMap
                                mapContainerStyle={{ height: '400px', width: '100%' }}
                                center={{ lat: 36.8065, lng: 10.1815 }} // Center the map to a default location
                                zoom={10}
                            >
                                <HeatmapLayer data={heatmapPoints} />
                            </GoogleMap>
                        </LoadScript>
                    </Grid>
                </Grid>
            )}
        </MainCard>
    );
};

export default OutagePage;
