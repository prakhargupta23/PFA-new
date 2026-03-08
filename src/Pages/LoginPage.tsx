import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Grid,
  Box,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { userService } from "../services/user.service";
import { useNavigate } from "react-router-dom";
import bg3 from '../assets/bg3.png';
import loginleft from '../assets/loginleft.png';
import train from '../assets/Train.png';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: `url(${bg3}) center center no-repeat`,
        backgroundSize: `${100}% ${100}%`,
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <Box sx={{ mr: '0%', position: 'absolute', left: 450, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', zIndex: 2, pointerEvents: 'none' }}>
        <img src={train} alt="train" style={{ width: 700, opacity: 0.1, color: '#fff', filter: 'brightness(1) invert(1)', transform: 'scaleX(-1)' }} />
      </Box>
      <Grid container sx={{ minHeight: "100vh" }}>
        {/* Left half with image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", md: "block" },
            background: `url(${loginleft}) center center no-repeat`,
            backgroundSize: `${100}% ${100}%`,
            minHeight: "100vh",
          }}
        />
        {/* Right half with login card */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >

          <Paper
            elevation={0}
            sx={{
              p: 5,
              width: { xs: "90%", sm: 400 },
              textAlign: "center",
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 800,
                color: "#fff",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 4, fontWeight: 500 }}
            >
              Sign in to access the RailGuard PFA Portal
            </Typography>
            <Formik
              initialValues={{ username: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setLoading(true);
                try {
                  let response = await userService.login(
                    values.username,
                    values.password
                  );
                  if (response.success) {
                    const { role } = response.data;
                    localStorage.setItem("role", role);
                    setSnackbarOpen(true);
                    setSnackbarMessage("Login successfully");
                    if (role === "PFA") {
                      navigate("/Dashboard");
                    }
                    else if (role === "CAPEX") {
                      navigate("/Capex");
                    }
                    else if (role === "OWE") {
                      navigate("/OWE");
                    }
                  } else {
                    setSnackbarOpen(true);
                    setSnackbarMessage(`Login unsuccessfull ${response.message}`);
                  }
                  resetForm();
                } catch (error: any) {
                  setSnackbarOpen(false);
                  setSnackbarMessage(error.message);
                }
                setLoading(false);
                setSubmitting(false);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Box mb={3}>
                    <TextField
                      fullWidth
                      id="username"
                      name="username"
                      label="Username"
                      variant="outlined"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.4)',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: '#fff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#fff',
                            borderWidth: 2,
                          },
                        },
                        input: { color: '#fff' },
                        label: { color: 'rgba(255,255,255,0.8)', fontWeight: 500 },
                      }}
                    />
                  </Box>
                  <Box mb={4}>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      variant="outlined"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.4)',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: '#fff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#fff',
                            borderWidth: 2,
                          },
                        },
                        input: { color: '#fff' },
                        label: { color: 'rgba(255,255,255,0.8)', fontWeight: 500 },
                      }}
                    />
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      height: '3.2rem',
                      fontSize: '1rem',
                      background: 'linear-gradient(90deg, #1976d2 0%, #4791db 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
                      textTransform: 'none',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.23)',
                        transform: 'translateY(-2px)'
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            sx={{
              "& .MuiSnackbarContent-root": {
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginPage;
