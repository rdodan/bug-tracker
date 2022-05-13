import React, { useEffect, useState } from 'react'
import {Button, CssBaseline, TextField, Box, Alert, Typography, Container} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import {MenuItem } from '@mui/material'


function Editticket() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");

    const theme = createTheme();
    const params = useParams();
    const nagivate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState(false);

    const handleChangeTitle = (e) => {
      setTitle(e.target.value)
    }

    const handleChangeDescription = (e) => {
      setDescription(e.target.value)
    }

    const handleChangeType = (e) => {
        setType(e.target.value)
    }

    const handleChangePriority = (e) => {
        setPriority(e.target.value)
    }

    const handleChangeStatus = (e) => {
        setStatus(e.target.value)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          console.log(params);
          const resp = await axios.put(`http://localhost:3000/tickets/edit/${params.idBug}/${params.idTicket}`, {
            title,
            description,
            type,
            status,
            priority,
          })
          setAlert(true);
          setError(false);
          nagivate(-1);
        } catch (err) {
          setError(true);
          setAlert(false);
          console.log(err.response.data);
        }
    }

    useEffect(() => {
      const getData = async () => {
        try {
          const resp = await axios.get(`http://localhost:3000/tickets/${params.idBug}/${params.idTicket}`)
          setTitle(resp.data.title);
          setDescription(resp.data.description);
          setType(resp.data.type);
          setPriority(resp.data.priority);
          setStatus(resp.data.status);
        } catch (err) {
          console.log(err.response.data);
        }
      }
      getData();
    }, [])


  return (
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      {alert && <Alert onClose={() => {setAlert(false)}} severity="success">Bug changed successfully!</Alert>}
      {error && <Alert onClose={() => {setError(false)}} severity="error">Please fill out everything</Alert>}
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4">
          Edit Ticket
        </Typography>
        <Box component="form"  onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            value={title}
            label="Title"
            name="title"
            autoComplete="title"
            autoFocus
            onChange={handleChangeTitle}
            />
            <TextField
            margin="normal"
            multiline
            rows={4}
            required
            fullWidth
            name="description"
            label="Description"
            id="description"
            autoComplete="description"
            value={description}
            onChange={handleChangeDescription}
            />
            
            {/* Type */}
            <TextField
            margin="normal"
            required
            name="type"
            label="Type"
            select
            fullWidth
            value={type} 
            onChange={handleChangeType}
            >
            <MenuItem value={"Issue"}>Issue</MenuItem>
            <MenuItem value={"Bug"}>Bug</MenuItem>
            <MenuItem value={"Feature"}>Feature</MenuItem>
            </TextField>

            {/* Priority */}
            <TextField
            margin="normal"
            required
            name="priority"
            label="Priority"
            select
            fullWidth
            value={priority} 
            onChange={handleChangePriority}
            >
            <MenuItem value={"Immediate"}>Immediate</MenuItem>
            <MenuItem value={"High"}>High</MenuItem>
            <MenuItem value={"Medium"}>Medium</MenuItem>
            <MenuItem value={"Low"}>Low</MenuItem>
            </TextField>

            {/* Status */}
            <TextField
            margin="normal"
            required
            name="status"
            label="Status"
            select
            fullWidth
            value={status} 
            onChange={handleChangeStatus}
            >
            <MenuItem value={"Resolved"}>Resolved</MenuItem>
            <MenuItem value={"In progress"}>In progress</MenuItem>
            <MenuItem value={"Unresolved"}>Unresolved</MenuItem>
            </TextField>
            <Box textAlign='center'>
              <Button     
                type="submit"
                variant='contained' 
                sx={{ mt: 3, mb: 2 }}
              >
                Save changes
              </Button>
            </Box> 
        </Box>
      </Box>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
  </ThemeProvider>
  )
}

export default Editticket