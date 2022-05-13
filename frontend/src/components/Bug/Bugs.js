import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {Grid, Container, Typography, Alert} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import Bug from './Bug.js';

function Posts() {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState([]); // get all the bugs
  const [error, setError] = useState(false); // set for alert
  const [err, setErr] = useState(""); // error message from backend
  const [message, setMessage] = useState(false);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const resp = await axios.get('/bugs');
        console.log(resp.data);
        if (resp.data.length === 0) {
          setMessage(true);
        } else {
          setMessage(false);
        }
        setBugs(resp.data);
      } catch(err) {
        navigate("/login");
      };
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const resp = await axios.delete(`bugs/delete/${id}`);
      console.log(resp);

      const resp2 = await axios.get('/bugs');
      setBugs(resp2.data);
      if (resp2.data.length === 0) {
        setMessage(true);
      } else {
        setMessage(false);
      }
      setError(false);
    } catch (err) {
      setError(true);
      setErr(err.response.data.message)
      console.log(err.response.data);
    }
  }



  return (
    <div>
      {message && <Container>
          <h3>No bugs yet!</h3>
        </Container>}
      {!message && <Container>
        <Container>
          {error && <Alert onClose={() => {setError(false)}} severity="error">{err}</Alert>}
        </Container>
        <Grid container spacing={3}>
          {bugs.map(bug => (
            <Grid item key={bug._id} xs={12} md={6} lg={4}>
              <Bug bug={bug} handleDelete={handleDelete}/>
            </Grid>
          ))}
        </Grid>
      </Container>}
    </div>
  )
}

export default Posts