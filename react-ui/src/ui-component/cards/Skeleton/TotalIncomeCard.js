import React from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Skeleton } from '@material-ui/core';
import ElectricBolt from '@mui/icons-material/ElectricBolt';


// style constant
const useStyles = makeStyles({
    content: {
        padding: '16px !important'
    },
    padding: {
        paddingTop: 0,
        paddingBottom: 0
    }
});

//-----------------------|| SKELETON - Monthly Consumption card ||-----------------------//

const TotalIncomeCard = () => {
    const classes = useStyles();
    return (
        <Card>
            <CardContent className={classes.content}>
                <List className={classes.padding}>
                    <ListItem alignItems="center" disableGutters className={classes.padding}>
                        <ListItemAvatar>
                            <ElectricBolt variant="rect" width={44} height={44} />
                        </ListItemAvatar>
                        <ListItemText
                            className={classes.padding}
                            primary={<Skeleton variant="rect" height={20} />}
                            secondary={<Skeleton variant="text" />}
                        />
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    );
};

export default TotalIncomeCard;
