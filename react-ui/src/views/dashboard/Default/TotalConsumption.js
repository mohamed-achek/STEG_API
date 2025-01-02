import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { Grid, MenuItem, TextField, Typography, useTheme } from '@material-ui/core';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from '../../../ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';

// Hook to fetch consumption data
const useFetchConsumptionData = (userId) => {
    const [consumptionData, setConsumptionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConsumptionData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/consumption?user_id=${userId}`);
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
    }, [userId]);

    return { consumptionData, isLoading };
};

// Function to group consumption data by month
const groupConsumptionByMonth = (data) => {
    const groupedData = {};

    data.forEach(item => {
        const date = new Date(item.date);
        const month = date.toLocaleString('default', { month: 'short' });
        if (!groupedData[month]) {
            groupedData[month] = 0;
        }
        groupedData[month] += parseFloat(item.consumption);
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seriesData = months.map(month => groupedData[month] || 0);

    return seriesData;
};

//-----------------------|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||-----------------------//

const TotalGrowthBarChart = () => {
    const userId = 1; // User ID to fetch data for
    const { consumptionData, isLoading } = useFetchConsumptionData(userId);
    const theme = useTheme();

    const primary = theme.palette.text.primary;
    const grey200 = theme.palette.grey[200];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;
    const grey500 = theme.palette.grey[500];

    const seriesData = groupConsumptionByMonth(consumptionData);

    const chartOptions = {
        chart: {
            id: 'monthly-consumption-chart',
            type: 'bar',
            toolbar: {
                show: true
            }
        },
        colors: [primary200, primaryDark, secondaryMain, secondaryLight],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                style: {
                    colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: [primary]
                }
            }
        },
        grid: {
            borderColor: grey200
        },
        tooltip: {
            theme: 'light'
        },
        legend: {
            labels: {
                colors: grey500
            }
        }
    };

    return (
        <MainCard title="Monthly Consumption in kWh">
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Chart
                            options={chartOptions}
                            series={[{ name: 'Consumption', data: seriesData }]}
                            type="bar"
                            height={350}
                        />
                    </Grid>
                </Grid>
            )}
        </MainCard>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
