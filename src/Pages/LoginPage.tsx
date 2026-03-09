import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Box,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { userService } from "../services/user.service";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bg3 from '../assets/railway_modern_bg.png';
import TrainIcon from "@mui/icons-material/Train";

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
        background: `url(${bg3}) center center/cover no-repeat`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Dark overlay for better text readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      />

      <Box sx={{ zIndex: 2, width: "100%", display: "flex", justifyContent: "center", px: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, md: 6 },
              width: { xs: "100%", sm: 450 },
              textAlign: "center",
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  backgroundColor: "rgba(25, 118, 210, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  mb: 3,
                  border: "2px solid rgba(25, 118, 210, 0.5)",
                  boxShadow: "0 0 20px rgba(25, 118, 210, 0.4)",
                }}
              >
                <TrainIcon sx={{ fontSize: 40, color: "#60a5fa" }} />
              </Box>
            </motion.div>

            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "0.5px",
                mb: 1,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              RailGuard PFA Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 4, fontWeight: 400 }}
            >
              Sign in to access the portal
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
        </motion.div>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: snackbarMessage.includes("success") ? "#059669" : "#dc2626",
            color: "white",
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
          },
        }}
      />
    </Box>
  );
}

export default LoginPage;
