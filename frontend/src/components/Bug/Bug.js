import React from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  default: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  size: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }
});


function Bug({ bug, handleDelete }) {

  const navigate = useNavigate();


  const classes = useStyles();
  return (
    <div >
      <Card>
        <CardHeader
          title={bug.title}
        />
          <CardContent>
            <Typography>
              {bug.completed === true && <Typography variant="body4" color='green'> Completed </Typography>}
              {bug.completed === false && <Typography variant="body4" color='red'> Uncompleted </Typography>}
            </Typography>  
          </CardContent>
        
          <CardActions className={classes.default}>
            <Button 
            onClick={() => navigate(`/bugs/${bug._id}`)}
            size="small" 
            color="primary"
            >
              Details
            </Button>
            <Button 
            onClick={() => navigate(`/editbug/${bug._id}`)}
            size="small" 
            color="primary"
            >
              Edit
            </Button>
            <Button 
            onClick={() => handleDelete(bug._id)}
            size="small" 
            color="error"
            >
              Delete
            </Button>
        </CardActions>
      </Card>
    </div>
  )
}

export default Bug