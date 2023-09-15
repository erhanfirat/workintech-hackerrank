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
import { doSRRequest } from "../api/api";
import { srEndpoints } from "../api/srEndpoints";
import SpinnerButton from "../components/atoms/SpinnerButton";
import { useState } from "react";

export const LoginPage = () => {
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

  const [loading, setLoading] = useState(false);

  const handleLogin = (loginData) => {
    setLoading(true);
    doSRRequest(srEndpoints.login(loginData))
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <PageDefault pageTitle="Kullanıcı Giriş Sayfası">
      <Container fluid>
        <Form onSubmit={handleSubmit(handleLogin)}>
          <FormGroup>
            <Label>Email</Label>
            <FormInput type="email" name="email" register={register} />
            <FormFeedback>{errors.email}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Şifre</Label>
            <FormInput type="password" name="password" register={register} />
            <FormFeedback>{errors.password}</FormFeedback>
          </FormGroup>
          <SpinnerButton loading={loading} color="primary" type="submit">
            Giriş
          </SpinnerButton>
        </Form>
      </Container>
    </PageDefault>
  );
};
