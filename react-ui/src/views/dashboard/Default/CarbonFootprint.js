import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Avatar, Grid, Typography } from '@material-ui/core';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import SkeletonTotalOrderCard from '../../../ui-component/cards/Skeleton/EarningCard';

// assets
import EcoIcon from '@mui/icons-material/EnergySavingsLeaf'; 
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

// style constant
const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.palette.primary.dark,
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        '&>div': {
            position: 'relative',
            zIndex: 5
        },
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: theme.palette.primary[800],
            borderRadius: '50%',
            zIndex: 1,
            top: '-85px',
            right: '-95px',
            [theme.breakpoints.down('xs')]: {
                top: '-105px',
                right: '-140px'
            }
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            zIndex: 1,
            width: '210px',
            height: '210px',
            background: theme.palette.primary[800],
            borderRadius: '50%',
            top: '-125px',
            right: '-15px',
            opacity: 0.5,
            [theme.breakpoints.down('xs')]: {
                top: '-155px',
                right: '-70px'
            }
        }
    },
    content: {
        padding: '20px !important'
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.primary[800],
        color: '#fff',
        marginTop: '8px'
    },
    cardHeading: {
        fontSize: '2.125rem',
        fontWeight: 500,
        marginRight: '8px',
        marginTop: '14px',
        marginBottom: '6px'
    },
    subHeading: {
        fontSize: '1rem',
        fontWeight: 500,
        color: theme.palette.primary[200]
    },
    avatarCircle: {
        ...theme.typography.smallAvatar,
        cursor: 'pointer',
        backgroundColor: theme.palette.primary[200],
        color: theme.palette.primary.dark
    },
    circleIcon: {
        transform: 'rotate3d(1, 1, 1, 45deg)'
    }
}));

const CarbonFootprintCard = ({ isLoading }) => {
    const classes = useStyles();
    const [carbonFootprint, setCarbonFootprint] = useState(0);
    const [treesSaved, setTreesSaved] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConsumptionData = async () => {
            try {
                console.log('Fetching consumption data...');
                const response = await fetch('/api/consumption');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('No consumption data found or invalid format');
                }
                console.log('Fetched consumption data:', data); // Log the fetched data
                calculateEnvironmentalImpact(data);
            } catch (error) {
                console.error('Error fetching consumption data:', error);
                setError('Failed to fetch consumption data. Please try again later.');
            }
        };

        fetchConsumptionData();
    }, []);

    const calculateEnvironmentalImpact = (data) => {
        const yearlyConsumption = {};

        data.forEach(item => {
            if (!item.date || !item.consumption) {
                console.error('Invalid data format:', item);
                return;
            }

            const date = new Date(item.date);
            if (isNaN(date.getTime())) {
                console.error('Invalid date format:', item.date);
                return;
            }

            const year = date.getFullYear();

            // Aggregate yearly consumption
            if (!yearlyConsumption[year]) {
                yearlyConsumption[year] = 0;
            }
            yearlyConsumption[year] += item.consumption;
        });

        const totalYearlyConsumption = Object.values(yearlyConsumption).reduce((sum, value) => sum + value, 0);

        console.log('Total yearly consumption:', totalYearlyConsumption); // Log total yearly consumption

        const carbonFootprintYearly = totalYearlyConsumption * 0.92; // Example conversion factor
        const treesSavedYearly = totalYearlyConsumption * 0.06; // Example conversion factor

        console.log('Carbon footprint (yearly):', carbonFootprintYearly); // Log carbon footprint (yearly)
        console.log('Trees saved (yearly):', treesSavedYearly); // Log trees saved (yearly)

        setCarbonFootprint(carbonFootprintYearly);
        setTreesSaved(treesSavedYearly);
    };

    return (
        <React.Fragment>
            {console.log('Rendering CarbonFootprintCard...')}
            {isLoading ? (
                <SkeletonTotalOrderCard />
            ) : error ? (
                <Typography variant="body2" color="error">{error}</Typography>
            ) : (
                <MainCard border={false} className={classes.card} contentClass={classes.content}>
                    <Grid container direction="column">
                        <Grid item>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Avatar variant="rounded" className={classes.avatar}>
                                        <EcoIcon fontSize="inherit" />
                                    </Avatar>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sx={{ mb: 0.75 }}>
                            <Grid container alignItems="center">
                                <Grid item xs={6}>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography className={classes.cardHeading}>{carbonFootprint.toFixed(2)} kg CO2</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Avatar className={classes.avatarCircle}>
                                                <ArrowDownwardIcon fontSize="inherit" className={classes.circleIcon} />
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography className={classes.subHeading}>Carbon Footprint</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className={classes.cardHeading}>
                                        {treesSaved.toFixed(2)} Trees Saved
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </React.Fragment>
    );
};

CarbonFootprintCard.propTypes = {
    isLoading: PropTypes.bool
};

CarbonFootprintCard.defaultProps = {
    isLoading: false
};

export default CarbonFootprintCard;
