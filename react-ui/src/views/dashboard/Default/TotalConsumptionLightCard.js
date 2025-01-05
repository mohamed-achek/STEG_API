import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import MonthlyConsumptionCard from '../../../ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';

// style constant
const useStyles = makeStyles((theme) => ({
    card: {
        overflow: 'hidden',
        position: 'relative',
        height: '150px', // Increase the height of the card
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: 'linear-gradient(210.04deg, ' + theme.palette.primary.dark + ' -50.94%, rgba(144, 202, 249, 0) 83.49%)',
            borderRadius: '50%',
            top: '-30px',
            right: '-180px'
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: 'linear-gradient(140.9deg, ' + theme.palette.primary.dark + ' -14.02%, rgba(144, 202, 249, 0) 70.50%)',
            borderRadius: '50%',
            top: '-160px',
            right: '-130px'
        }
    },
    content: {
        padding: '16px !important',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.dark
    },
    secondary: {
        color: theme.palette.grey[500],
        marginTop: '5px',
        textAlign: 'center'
    },
    padding: {
        paddingTop: 0,
        paddingBottom: 0
    }
}));

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

//-----------------------|| DASHBOARD - Monthly CONSUMPTION LIGHT CARD ||-----------------------//

const MonthlyConsumptionLightCard = ({ isLoading }) => {
    const classes = useStyles();
    const userId = 1; // User ID to fetch data for
    const { consumptionData, isLoading: dataLoading } = useFetchConsumptionData(userId);

    // Calculate total consumption for the last year
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const totalConsumptionLastYear = consumptionData
        .filter(item => new Date(item.date).getFullYear() === previousYear)
        .reduce((total, item) => total + parseFloat(item.consumption), 0)
        .toFixed(2);

    return (
        <React.Fragment>
            {isLoading || dataLoading ? (
                <MonthlyConsumptionCard />
            ) : (
                <MainCard className={classes.card} contentClass={classes.content}>
                    <List className={classes.padding}>
                        <ListItem alignItems="center" disableGutters className={classes.padding}>
                            <ListItemAvatar>
                                <Avatar variant="rounded" className={classes.avatar}>
                                    <ElectricMeterIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{
                                    mt: 3.2, // Move text down
                                    mb: 3.2, // Move text down
                                    textAlign: 'center'
                                }}
                                className={classes.padding}
                                primary={<Typography variant="h3">{totalConsumptionLastYear} kWh</Typography>} // Make text bigger
                                secondary={
                                    <Typography variant="subtitle1" className={classes.secondary}>
                                        Total Consumption Last Year
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>
                </MainCard>
            )}
        </React.Fragment>
    );
};

MonthlyConsumptionLightCard.propTypes = {
    isLoading: PropTypes.bool
};

export default MonthlyConsumptionLightCard;
