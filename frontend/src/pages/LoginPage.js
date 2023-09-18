import { useForm } from "react-hook-form";
import {
  Button,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Label,
} from "reactstrap";
import PageDefault from "./PageDefault";
import FormInput from "../components/atoms/FormInput";
import SpinnerButton from "../components/atoms/SpinnerButton";
import { useDispatch, useSelector } from "react-redux";
import { loginActionCreator } from "../store/reducers/userReducer";
import { FETCH_STATES } from "../utils/constants";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const userFetchState = useSelector((s) => s.user.fetchState);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginCallback = () => {
    history.push(location?.state?.referrer ? location.state.referrer : "/");
  };

  const handleLogin = (loginData) => {
    dispatch(loginActionCreator(loginData, loginCallback));
  };

  useEffect(() => {
    if (userFetchState === FETCH_STATES.FETHCED) {
      loginCallback();
    }
  }, [userFetchState]);

  return (
    <PageDefault pageTitle="Kullanıcı Giriş Sayfası">
      <Container fluid>
        <Form
          onSubmit={handleSubmit(handleLogin)}
          className="border px-3 py-5 shadow login-form rounded"
          noValidate="noValidate"
        >
          <FormGroup>
            <Label>Email</Label>
            <FormInput
              type="email"
              name="email"
              register={register}
              validation={{
                required: "Email bilgisini giriniz.",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Lütfen geçerli bir Email adresi giriniz.",
                },
              }}
              invalid={!!errors.email?.message}
            />
            <FormFeedback>{errors.email?.message}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Şifre</Label>
            <FormInput
              type="password"
              name="password"
              register={register}
              validation={{
                required: "Şifre bilgisini giriniz.",
                minLength: {
                  value: 6,
                  message: "En az 6 karakter girmeniz gerekmektedir.",
                },
              }}
              invalid={!!errors.password?.message}
            />
            <FormFeedback>{errors.password?.message}</FormFeedback>
          </FormGroup>
          <SpinnerButton
            loading={userFetchState === FETCH_STATES.FETCHING}
            color="primary"
            type="submit"
          >
            Giriş
          </SpinnerButton>
        </Form>
      </Container>
    </PageDefault>
  );
};
