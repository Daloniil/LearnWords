import {Card, CardContent, makeStyles, Typography} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        margin: 'auto',
        marginTop: '20%',
        textAlign: 'center',
        backgroundColor: '#f44336', // Red color
        color: 'white',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        marginTop: 12,
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    img: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1,
    },
});

export const BlockedAccessCard = () => {
    const classes = useStyles();

    return (
        <div className={classes.background}>
            <img src="/The_Hell.webp" alt="Hell Background" className={classes.img}/>
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} gutterBottom>
                        Ваш доступ временно заблокирован
                    </Typography>
                    <Typography className={classes.content}>
                        Пожалуйста, свяжитесь с администрацией для разрешения этой проблемы.
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}