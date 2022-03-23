import axios from "axios";
import Link from "next/link";
import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Avatar,
  Card,
  CardActions,
  CardContent,
  TextField,
  CardMedia,
  Input,
  Backdrop,
  CircularProgress,
  Alert,
  AlertTitle,
  Fade,
  Snackbar,
} from "@mui/material";

import ShowCodes from "../components/homePage/ShowCodes";
import Head from "next/head";
import Layout from "../components/Layout";
import { FcGoogle } from "react-icons/fc";
import { BsCheckSquare } from "react-icons/bs";
import Introduce from "../components/homePage/Introduce";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { Bars } from "react-loading-icons";
import { useRouter } from "next/router";
import LoadingBox from "../components/homePage/LoadingBox";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const refreshLoading = useRef();
  const refreshError = useRef();

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm();
  useEffect(() => {
    return () => {
      clearTimeout(refreshLoading.current);
      clearTimeout(refreshError.current);
    };
  }, []);
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  const onSubmit = async (data) => {
    if (status !== "authenticated") {
      try {
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);
        const result = await signIn("login", {
          account: data.account,
          password: data.password,
          redirect: false,
        });
        if (!result.error) {
          setIsSuccess(true);
          setIsError(false);
          refreshLoading.current = setTimeout(() => {
            setIsLoading(false);
            reset({ account: "", password: "" });
          }, 1000);
        } else {
          setMessageError(result.error);
          setIsError(true);
          setIsLoading(false);
          refreshError.current = setTimeout(() => {
            setIsError(false);
            setMessageError("");
          }, 5000);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const LoginTitle = styled(Typography)({
    color: "#f4604c",
    alignSelf: "flex-start",
    fontWeight: "bold",
    fontSize: "35px",
  });
  const SignupLink = styled(Link)({
    color: "#54d9b6",
    textDecoration: "revert",
  });
  const LabelInput = styled(Typography)({
    fontWeight: "500",
    opacity: "0.7",
  });
  const InputLogin = styled(TextField)({
    height: "45px",
  });
  const ButtonLogin = styled(Button)({
    backgroundColor: "#0a8080",
    color: "#fff",
    textTransform: "none",

    "&:hover": {
      backgroundColor: "#0a8080",
      opacity: 0.8,
    },
  });
  const ButtonLoginSocial = styled(Button)({
    color: "#fff",
    textTransform: "none",
    border: "2px solid",
    color: "#0a8080",
    backgroundColor: "#fff",

    "&:hover": {
      backgroundColor: "#fff",
      opacity: 0.8,
    },
  });

  return (
    <>
      {status !== "authenticated" && (
        <>
          <Head>
            <title> Đăng nhập tài khoản</title>
          </Head>
          <Layout>
            <LoadingBox isSuccess={isSuccess} isLoading={isLoading} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "background.default",
                justifyContent: "space-around",
                color: "text.primary",
                gap: "10px",
                padding: { xs: "0 10px", md: "0 20px" },
              }}
            >
              <CardMedia
                component="img"
                sx={{ maxWidth: "450px", display: { xs: "none", md: "block" } }}
                image="https://i.imgur.com/25eZxv6.png"
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  bgcolor: "background.default",
                  justifyContent: "center",
                  color: "text.primary",
                  gap: "10px",
                  padding: "40px 0",
                  minWidth: "300px",
                }}
              >
                <LoginTitle>LeThinh Blog</LoginTitle>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "500",
                      fontSize: "30px",
                    }}
                  >
                    Welcome back to LT Blog
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "18px",
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                    component="div"
                  >
                    No account?
                    <Typography
                      sx={{
                        color: "#54d9b6",
                        textDecoration: "revert",
                        fontWeight: "bold",
                      }}
                    >
                      <Link href="/signup">Create account</Link>
                    </Typography>
                  </Typography>
                  {isError && (
                    <Fade in={isError}>
                      <Alert
                        sx={{
                          minWidth: "300px",
                        }}
                        severity="error"
                      >
                        <AlertTitle>Error</AlertTitle>
                        {messageError} — <strong>try again!</strong>
                      </Alert>
                    </Fade>
                  )}
                </Box>

                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "15px",
                  }}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <FormControl
                    variant="standard"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <LabelInput>Account</LabelInput>
                    <Controller
                      name="account"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          size="small"
                          fullWidth
                          error={errors.account ? true : false}
                          helperText={errors.account ? errors.account.message : ""}
                          // {...(field,
                          // {
                          //   required: "Account is a required",
                          //   minLength: { value: 5, message: "Min-length 5, please re-enter" },
                          // })}
                          {...register("account", {
                            required: "Account is a required",
                            minLength: { value: 5, message: "Min-length 5, please re-enter" },
                          })}
                        />
                      )}
                      defaultValue=""
                    />
                  </FormControl>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <LabelInput>Password</LabelInput>
                      <LabelInput
                        sx={{
                          color: "#54d9b6",
                          opacity: "1",
                          fontWeight: "bold",
                        }}
                      >
                        For got your Password
                      </LabelInput>
                    </Box>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          type="password"
                          size="small"
                          fullWidth
                          error={errors.password ? true : false}
                          helperText={errors.password ? errors.password.message : ""}
                          {...field}
                          {...register("password", {
                            required: "Password is a required",
                          })}
                        />
                      )}
                      defaultValue=""
                    />
                  </FormControl>
                  <ButtonLogin type="submit" onClick={handleSubmit(onSubmit)} variant="contained">
                    Sign in
                  </ButtonLogin>
                </form>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <LabelInput
                    sx={{
                      alignSelf: "center",
                    }}
                  >
                    or sign in with
                  </LabelInput>

                  <ButtonLoginSocial onClick={() => signIn("google")} variant="contained">
                    <FcGoogle /> Google
                  </ButtonLoginSocial>
                </Box>
              </Box>
            </Box>
          </Layout>
        </>
      )}
    </>
  );
};

export default Login;
