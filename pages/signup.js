import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Fade,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getSession, signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import Layout from "../components/Layout";
import LoadingBox from "../components/homePage/LoadingBox";
import AuthService from "../services/client/AuthService";
const LoginTitle = styled(Typography)({
  color: "#f4604c",
  alignSelf: "flex-start",
  fontWeight: "bold",
  fontSize: "3.5rem",
});

const LabelInput = styled(Typography)({
  fontWeight: "500",
  opacity: "0.7",
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
const ErrorPassWord = styled(Typography)({
  fontWeight: "400",
  fontSize: "1.3rem",
  lineHeight: 1.66,
  textAlign: "left",
  margin: "4px 14px 0 14px",
  color: "#f44336",
});

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const refreshLoading = useRef();
  const refreshError = useRef();
  // form validation rules
  const validationSchema = Yup.object().shape({
    account: Yup.string()
      .required("Account is required")
      .min(5, "Min-length 5, please re-enter")
      .trim("Account invalid")
      .matches(/^\S*$/, "Account invalid")
      .strict(true),
    name: Yup.string()
      .required("Name is required")
      .min(2, "Min-length 2, please re-enter")
      .trim("Name invalid")
      .strict(true),
    password: Yup.string()
      .required("Password is required")
      .trim("Password invalid")
      .matches(/^\S*$/, "Password invalid")
      .strict(true),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm(formOptions);
  useEffect(() => {
    return () => {
      clearTimeout(refreshLoading.current);
      clearTimeout(refreshError.current);
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      const { account, password, confirmPassword, name } = data;
      await AuthService.signUpAccount({
        account,
        password,
        confirmPassword,
        name,
      });
      setIsSuccess(true);
      setIsError(false);
      refreshLoading.current = setTimeout(() => {
        setIsLoading(false);
        reset();
      }, 3000);
      // Login
      await AuthService.loginAccount({
        account,
        password,
      });
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        setMessageError(err.response.data.message);
        setIsError(true);
        refreshError.current = setTimeout(() => {
          setIsError(false);
          setMessageError("");
        }, 5000);
      }
    }
  };

  return (
    <>
      <NextSeo
        title="Đăng ký tài khoản - LeThinh Blog"
        description="Đăng ký tài khoản thành viên vào website LeThinhg Blog"
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${process.env.NEXTAUTH_URL}/signup`,
          images: [
            {
              url: "https://i.imgur.com/0rWGRIi.png",
              width: 700,
              height: 700,
              alt: "Đăng ký tài khoản - LeThinh Blog",
            },
          ],
        }}
        twitter={{
          handle: "Thinh Le",
          site: `${process.env.NEXTAUTH_URL}/signup`,
          cardType: "summary_large_image",
        }}
      />

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
              maxWidth: "400px",
              width: "100%",
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
                  fontSize: "3rem",
                }}
              >
                Welcome to LT Blog
              </Typography>
              <Typography
                sx={{
                  fontWeight: "400",
                  fontSize: "1.8rem",
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                }}
                component="div"
              >
                Have an account?
                <Typography
                  sx={{
                    color: "#54d9b6",
                    textDecoration: "revert",
                    fontWeight: "bold",
                  }}
                >
                  <Link href="/login">Login account</Link>
                </Typography>
              </Typography>
              {isError && (
                <Fade in={isError}>
                  <Alert
                    sx={{
                      maxWidth: "400px",
                      width: "100%",
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
                  render={({ field: { ref, ...field } }) => (
                    <TextField
                      size="small"
                      fullWidth
                      error={errors.account ? true : false}
                      helperText={errors.account ? errors.account.message : ""}
                      inputRef={ref}
                      {...field}
                    />
                  )}
                  defaultValue=""
                />
              </FormControl>
              <FormControl
                variant="standard"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <LabelInput>Name</LabelInput>
                <Controller
                  name="name"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <TextField
                      size="small"
                      fullWidth
                      error={errors.name ? true : false}
                      helperText={errors.name ? errors.name.message : ""}
                      inputRef={ref}
                      {...field}
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
                </Box>
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <OutlinedInput
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      type={showPassword ? "text" : "password"}
                      size="small"
                      fullWidth
                      error={errors.password ? true : false}
                      helperText={errors.password ? errors.password.message : ""}
                      inputRef={ref}
                      {...field}
                    />
                  )}
                  defaultValue=""
                />
                <ErrorPassWord>{errors.password ? errors.password.message : ""}</ErrorPassWord>
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
                </Box>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <OutlinedInput
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      type={showPassword ? "text" : "password"}
                      size="small"
                      fullWidth
                      error={errors.confirmPassword ? true : false}
                      helperText={errors.confirmPassword ? errors.confirmPassword.message : ""}
                      inputRef={ref}
                      {...field}
                    />
                  )}
                  defaultValue=""
                />
                <ErrorPassWord>{errors.confirmPassword ? errors.confirmPassword.message : ""}</ErrorPassWord>
              </FormControl>

              <ButtonLogin type="submit" onClick={handleSubmit(onSubmit)} variant="contained">
                Sign up
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
                or sign up with
              </LabelInput>

              <ButtonLoginSocial onClick={() => signIn("google")} variant="contained">
                <FcGoogle /> Google
              </ButtonLoginSocial>
            </Box>
          </Box>

          <Box
            sx={{
              maxWidth: "450px",
              width: "100%",
              height: "400px",
              display: { xs: "none", md: "block" },
              position: "relative",
            }}
          >
            <Image src="https://i.imgur.com/hXCY8V3.png" priority={true} layout="fill" alt="Đăng ký - LT Blog" />
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export default Signup;
export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  } else {
    return {
      props: {},
    };
  }
};
