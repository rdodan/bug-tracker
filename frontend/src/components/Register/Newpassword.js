import React from 'react'
import { useState } from 'react';
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Alert} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

const theme = createTheme();


function Signup() {

    const navigate = useNavigate();
    const params = useParams();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState(false);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post(`/users/newpassword/${params.id}`, {
                password,
                confirm
            })
            console.log(resp);
            setAlert(true);
            setError(false);
            navigate("/login");
        
        } catch (err) {
            setError(true);
            setAlert(false);
        }
    }

    return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            {alert && <Alert severity="success">An email has been sent to recover your password!</Alert>}
            {error && <Alert severity="error">Both passwords must match</Alert>}
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <Typography component="h1" variant="h5">
            New password
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid >
                    <TextField
                    margin="normal"
                    name="password"
                    type="password"
                    required
                    fullWidth
                    id="password"
                    label="New password"
                    autoFocus
                    value={password}
                    onChange = {e => setPassword(e.target.value)}
                    />
                <Grid>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="password"
                    id="confirm"
                    label="Confirm password"
                    name="confirm"
                    value={confirm}
                    onChange = {e => setConfirm(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                </Grid>
                </Grid>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Submit
                </Button>
                <Grid  sx={{ justifyContent: 'space-between' }}>
                <Link href="/login" variant="body2" sx={{r: 0}}>
                    Already have an account? Log in
                </Link>
                </Grid>
            </Box>
            </Box>
        </Container>
        </ThemeProvider>
    )
}

export default Signup;