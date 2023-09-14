import { useForm } from "react-hook-form";
import {
  Button,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import PageDefault from "./PageDefault";

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
            <Input type="email" {...register("email")} />
            <FormFeedback>{errors.email}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Şifre</Label>
            <Input type="password" {...register("password")} />
            <FormFeedback>{errors.password}</FormFeedback>
          </FormGroup>
          <Button type="submit">Giriş</Button>
        </Form>
      </Container>
    </PageDefault>
  );
};
