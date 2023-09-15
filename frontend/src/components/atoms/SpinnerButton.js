import { Button, Spinner } from "reactstrap";

const SpinnerButton = ({ children, loading, iconClass, ...rest }) => {
  return (
    <Button {...rest}>
      {loading && <Spinner size={"sm"} className="me-2 " />}
      {children}
    </Button>
  );
};

export default SpinnerButton;
