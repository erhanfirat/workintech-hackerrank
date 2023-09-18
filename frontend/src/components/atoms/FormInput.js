const { Input } = require("reactstrap");

const FormInput = ({ register, name, validation, ...rest }) => {
  const { ref, ...registerField } = register(name, validation);

  return <Input innerRef={ref} {...registerField} {...rest} />;
};

export default FormInput;
