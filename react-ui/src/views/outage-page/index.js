import React, { useEffect, useState } from 'react';
import { GoogleMap, HeatmapLayer, LoadScript } from '@react-google-maps/api';

// material-ui
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, TextField, Button } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant'; // Import gridSpacing

// Define the libraries array outside of the component
const libraries = ['visualization'];

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
    const [formData, setFormData] = useState({
        outage_type: '',
        start_time: '',
        description: '',
        status: 'Ongoing',
        region: ''
    });

    const handleLoad = () => {
        const points = heatmapData.map(data => ({
            location: new window.google.maps.LatLng(data.latitude, data.longitude),
            weight: data.weight
        }));
        setHeatmapPoints(points);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/outages/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Outage reported:', data);
            alert('✅ Outage reported successfully ! \n\nThank you for reporting the issue. \nOur team has received your report and will investigate the issue promptly. \nYou will be notified as soon as we have updates regarding this outage. \n\n📞 For urgent inquiries, contact our support team at 123-456-789. \n\nWe appreciate your help in improving our service!');
            // Optionally, refresh the outage data
        } catch (error) {
            console.error('Error reporting outage:', error);
        }
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
                                        <TableCell>Region</TableCell> {/* Add region column header */}
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
                                            <TableCell>{outage.region}</TableCell> {/* Add region data */}
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
                        <Typography variant="h4" gutterBottom>
                            Current Outages
                        </Typography>
                        <LoadScript
                            googleMapsApiKey="api key" 
                            libraries={libraries}
                            onLoad={handleLoad}
                        >
                            <GoogleMap
                                mapContainerStyle={{ height: '400px', width: '100%' }}
                                center={{ lat: 36.8065, lng: 10.1815 }} 
                                zoom={10}
                            >
                                <HeatmapLayer 
                                    data={heatmapPoints} 
                                    options={{
                                        radius: 30,
                                        opacity: 0.7
                                    }}
                                />
                            </GoogleMap>
                        </LoadScript>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>
                            Report an Outage
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Outage Type"
                                        name="outage_type"
                                        value={formData.outage_type}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Region"
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Start Time"
                                        name="start_time"
                                        type="datetime-local"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Report Outage
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            )}
        </MainCard>
    );
};

export default OutagePage;
