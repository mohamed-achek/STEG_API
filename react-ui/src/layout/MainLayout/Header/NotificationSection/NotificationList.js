import React from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import {
    Avatar,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Typography
} from '@material-ui/core';

// assets
import { IconCreditCard } from '@tabler/icons';
import User1 from './../../../../assets/images/users/user.png';

// style constant
const useStyles = makeStyles((theme) => ({
    navContainer: {
        width: '100%',
        maxWidth: '330px',
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '300px'
        }
    },
    listAction: {
        top: '22px'
    },
    actionColor: {
        color: theme.palette.grey[500]
    },

    listItem: {
        padding: 0
    },
    sendIcon: {
        marginLeft: '8px',
        marginTop: '-3px'
    },
    listDivider: {
        marginTop: 0,
        marginBottom: 0
    },
    listChipError: {
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.orange.light,
        height: '24px',
        padding: '0 6px',
        marginRight: '5px'
    },
    listChipWarning: {
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.warning.light,
        height: '24px',
        padding: '0 6px'
    },
    listChipSuccess: {
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light,
        height: '24px',
        padding: '0 6px'
    },
    listAvatarSuccess: {
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light,
        border: 'none',
        borderColor: theme.palette.success.main
    },
    listAvatarPrimary: {
        color: theme.palette.primary.dark,
        backgroundColor: theme.palette.primary.light,
        border: 'none',
        borderColor: theme.palette.primary.main
    },
    listContainer: {
        paddingLeft: '56px'
    },
    uploadCard: {
        backgroundColor: theme.palette.secondary.light
    },
    paddingBottom: {
        paddingBottom: '16px'
    },
    itemAction: {
        cursor: 'pointer',
        padding: '16px',
        '&:hover': {
            background: theme.palette.primary.light
        }
    }
}));

//-----------------------|| NOTIFICATION LIST ITEM ||-----------------------//

const NotificationList = () => {
    const classes = useStyles();

    return (
        <List className={classes.navContainer}>
            <div className={classes.itemAction}>
                <ListItem alignItems="center" className={classes.listItem}>
                    <ListItemAvatar>
                        <Avatar src={User1} />
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Mohamed Achek</Typography>} />
                    <ListItemSecondaryAction className={classes.listAction}>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={12}>
                                <Typography variant="caption" display="block" gutterBottom className={classes.actionColor}>
                                    2 min ago
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className={classes.listContainer}>
                    <Grid item xs={12} className={classes.paddingBottom}>
                        <Typography variant="subtitle2">Unexpected outage in Mourouj (details in outages section )</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item>
                                <Chip label="Unread" className={classes.listChipError} />
                            </Grid>
                            <Grid item>
                                <Chip label="New" className={classes.listChipWarning} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <Divider className={classes.listDivider} />
            <div className={classes.itemAction}>
                <ListItem alignItems="center" className={classes.listItem}>
                    <ListItemAvatar>
                        <Avatar className={classes.listAvatarPrimary}>
                            <IconCreditCard stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Payment successful</Typography>} />
                    <ListItemSecondaryAction className={classes.listAction}>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Typography variant="caption" display="block" gutterBottom className={classes.actionColor}>
                                    1 Hour ago
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className={classes.listContainer}>
                    <Grid item xs={12} className={classes.paddingBottom}>
                        <Typography variant="subtitle2">Your payment receipt is available !</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </List>
    );
};

export default NotificationList;
