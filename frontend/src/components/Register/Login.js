import React, { useState } from 'react'
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Alert} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import axios from 'axios';



const theme = createTheme();


function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [password, setPassowrd] = useState("");
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState(false);
    const [err, setErr] = useState("");
  
    const handleEmailChange = event => {
      setEmail(event.target.value)
    };

    const handlePasswordChange = e => {
        setPassowrd(e.target.value);
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const user = {
            email,
            password,
        }
        try {
            const resp = await axios.post('/users/login', user);
            console.log(resp);
            setAlert(true);
            setError(false);
            localStorage.setItem('name', resp.data.user.first);
            localStorage.setItem('role', resp.data.user.role);
            navigate("/");
        } catch (err) {
          setError(true);
          setAlert(false);
          setErr(err.response.data.message);
        }

    };


    return (
        
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            {alert && <Alert severity="success">Successfully logged in!</Alert>}
            {error && <Alert onClose={() => {setError(false)}} severity="error">{err}</Alert>}
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              </Avatar>
              <Typography component="h1" variant="h5">
                Log in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  value={email}
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleEmailChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Log in
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/forgotpassword" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
    )
}

export default Login;