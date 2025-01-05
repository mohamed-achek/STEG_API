import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Grid, Typography } from '@material-ui/core';
import MainCard from '../../../ui-component/cards/MainCard';
import SkeletonEarningCard from '../../../ui-component/cards/Skeleton/EarningCard';
import Co2Icon from '@mui/icons-material/Co2';


const useStyles = makeStyles((theme) => ({
    card: {
        background: 'linear-gradient(135deg, #4caf50 30%, #388e3c 90%)', // Gradient background for carbon footprint
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
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
            width: '210px',
            height: '210px',
            background: 'rgba(255, 255, 255, 0.1)',
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
        backgroundColor: '#388e3c', // Darker green
        marginTop: '8px'
    },
    avatarRight: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        backgroundColor: '#4caf50', // Green color
        color: '#fff',
        zIndex: 1
    },
    cardHeading: {
        fontSize: '2.125rem',
        fontWeight: 500,
        marginRight: '8px',
        marginTop: '8px', // Lift text up
        marginBottom: '6px'
    },
    subHeading: {
        fontSize: '1rem',
        fontWeight: 500,
        color: '#fff'
    },
    avatarCircle: {
        cursor: 'pointer',
        ...theme.typography.smallAvatar,
        backgroundColor: '#fff',
        color: '#4caf50' // Green color
    },
    circleIcon: {
        transform: 'rotate3d(1, 1, 1, 45deg)'
    },
    menuItem: {
        marginRight: '14px',
        fontSize: '1.25rem'
    }
}));

const CarbonFootprint = ({ userId, isLoading }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [yearlyCO2, setYearlyCO2] = useState(0);
    const [treesSaved, setTreesSaved] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConsumptionData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/consumption?user_id=${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched consumption data:', data); // Log the fetched data

                if (!Array.isArray(data)) {
                    throw new Error('Data is not an array');
                }

                const currentYear = new Date().getFullYear();
                const previousYear = currentYear - 1;
                const yearBeforeLast = currentYear - 2;

                const filteredDataPreviousYear = filterDataByYear(data, previousYear);
                const filteredDataYearBeforeLast = filterDataByYear(data, yearBeforeLast);

                console.log('Filtered data for previous year:', filteredDataPreviousYear);
                console.log('Filtered data for year before last:', filteredDataYearBeforeLast);

                const yearlyCO2PreviousYear = calculateYearlyCO2(filteredDataPreviousYear);
                const yearlyCO2YearBeforeLast = calculateYearlyCO2(filteredDataYearBeforeLast);

                setYearlyCO2(yearlyCO2PreviousYear);

                const co2Reduction = yearlyCO2YearBeforeLast - yearlyCO2PreviousYear;
                const treesEquivalent = calculateTreesSaved(co2Reduction);
                setTreesSaved(treesEquivalent);
            } catch (error) {
                console.error('Error fetching consumption data:', error);
                setError('Failed to fetch data. Please try again later.');
            }
        };

        fetchConsumptionData();
    }, [userId]);

    const filterDataByYear = (data, year) => {
        return data.filter(record => new Date(record.date).getFullYear() === year);
    };

    const calculateYearlyCO2 = (data) => {
        const CO2_PER_KWH = 0.233;
        const yearlyConsumption = data.reduce((total, record) => total + (record.consumption || 0), 0);
        return yearlyConsumption * CO2_PER_KWH;
    };

    const calculateTreesSaved = (co2Reduction) => {
        const CO2_PER_TREE = 21.77; // Average kg of CO2 absorbed by a tree per year
        return co2Reduction / CO2_PER_TREE;
    };


    return (
        <React.Fragment>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <MainCard border={false} className={classes.card} contentClass={classes.content}>
                    <Grid container direction="column">
                        <Grid item>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Typography className={classes.cardHeading}>{yearlyCO2.toFixed(2)} kg</Typography>
                                </Grid>
                                <Grid item>
                                    <Avatar variant="rounded" className={classes.avatar}>
                                        <Co2Icon fontSize="large" />
                                    </Avatar>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container alignItems="center">
                                <Grid item>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sx={{ mb: 1.25 }}>
                            <Typography className={classes.subHeading}>Yearly CO2 Impact</Typography>
                        </Grid>
                        <Grid item sx={{ mb: 1.25 }}>
                            <Typography className={classes.subHeading}>Equivalent to saving {treesSaved.toFixed(2)} trees compared to last year</Typography>
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </React.Fragment>
    );
};

CarbonFootprint.propTypes = {
    userId: PropTypes.number.isRequired,
    isLoading: PropTypes.bool
};

export default CarbonFootprint;
