import React, { useEffect, useRef, useState } from 'react'
import {useParams} from 'react-router-dom';
import {  Box, Container, Paper } from '@mui/material';
import axios from 'axios';
import TimeAgo from 'react-timeago';
import AllTickets from '../Ticket/AllTickets';
import { makeStyles } from '@mui/styles';
import { borderTop } from '@mui/system';

  const useStyles = makeStyles({
    default: {
      width: '40%',
      margin: "auto",
      marginBottom: "2%"
    },
    padding: {
      paddingLeft: '5%',
      paddingRight: '5%',
      paddingTop: '2%',
      paddingBottom: '1%'
    },
    spacing: {
      paddingLeft: '4%'
    },
    bottom: {
      MarginTop: '3%',
      borderTop: '1px solid grey'
    }
  })


function Getbug() {

    const params = useParams();  
    const [data, setData] = useState({});
    const [tags, setTags] = useState("");
    const [completed, setCompleted] = useState("");
    const [array, setArray] = useState([]);
    const tx = useRef("");
    const classes = useStyles();

    useEffect(() => {
        const getData = async () => {
           try {
                const resp = await axios.get(`http://localhost:3000/bugs/${params.id}`);
                setData(resp.data);
                resp.data.tags.map(obj => (
                  tx.current += obj.tag + " ",
                  setArray([...array, tx.current])
                ));
               if (resp.data.completed === true) {
                 setCompleted("Completed");
               } else {
                 setCompleted("Uncompleted");
               }
                setTags(tx.current);

           } catch (err) {
               console.log(err.response.data);
           }
        }

        getData();
    }, [])

  return (
    <Container >
      <Paper className={classes.default}>
        <Box className={classes.padding}>
          <h3>{data.title}</h3>
          <Box className={classes.spacing}>          
            <p>{data.description}</p>
              <h4>{completed}</h4>
              <Box className={classes.bottom}>
              <p>Created <TimeAgo date={data.createdAt}/></p>
            </Box>
          </Box>
        </Box>
      </Paper>
      <AllTickets/>
    </Container>
  )
}

export default Getbug