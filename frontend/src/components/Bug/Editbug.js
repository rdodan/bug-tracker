import React, { useEffect, useRef, useState } from 'react'
import {Button, CssBaseline, TextField, Box, Typography, Container, FormControl, RadioGroup, FormLabel, FormControlLabel, Radio, Alert} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';



function Editbug() {

  const params = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const tx = useRef("");

  const [completed, setCompleted] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(false);



  const handleTitleChange = e => {
    setTitle(e.target.value)
  };

  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  }

  const handleCompletedChange = e => {
    setCompleted(e.target.value);
  }

  const handleTagsComplete = e => {
    setTags(e.target.value);
  }

  useEffect(() => {

    const getData = async () => {
      try {
          const resp = await axios.get(`/bugs/${params.id}`)
          setTitle(resp.data.title);
          setDescription(resp.data.description);
          resp.data.tags.map(obj => (
            tx.current += obj.tag + " "
          ));
          setTags(tx.current);
          setCompleted(resp.data.completed);
      } catch (err) {
        console.log(err.response.data);
      }
    }

    getData();
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.put(`/bugs/edit/${params.id}`, {
        title,
        description,
        tags,
        completed
      })
      console.log(resp.data);
      setAlert(true);
      setError(false);
      navigate("/");
    } catch (err) {
      setAlert(false);
      setError(true);
      console.log(err.response.data);
    }
  }

  const theme = createTheme();
  
  return (
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      {alert && <Alert onClose={() => {setAlert(false)}} severity="success">Bug changed successfully!</Alert>}
      {error && <Alert onClose={() => {setError(false)}} severity="error">Something went wrong!</Alert>}
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
          Edit bug
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            onChange={handleTitleChange}
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
            onChange={handleDescriptionChange}
          />
           <TextField
            margin="normal"
            fullWidth
            id="tags"
            value={tags}
            label="Tags"
            name="tags"
            autoComplete="tags"
            autoFocus
            onChange={handleTagsComplete}
          />
          <Box textAlign='center'>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Completed</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={completed}
                onChange={handleCompletedChange}
              >
                <FormControlLabel value={true} control={<Radio />} label="True" />
                <FormControlLabel value={false} control={<Radio />} label="False" />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box textAlign='center'>
            <Button     
              type="submit"
              color= 'primary'
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

export default Editbug