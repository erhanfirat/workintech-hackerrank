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

  const handleLogin = (loginData) => {
    console.log("loginData ", loginData);
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
          <Button type="submit">Giriş</Button>
        </Form>
      </Container>
    </PageDefault>
  );
};
