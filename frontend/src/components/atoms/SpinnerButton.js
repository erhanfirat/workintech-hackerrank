import { Button, Spinner } from "reactstrap";

const SpinnerButton = ({ children, loading, iconClass, ...rest }) => {
  return (
    <Button {...rest}>
      {!iconClass && loading && <Spinner size={"sm"} className="me-2 " />}
      {iconClass && <i className={`${iconClass} ${loading ? "rotate" : ""}`} />}
      {children}
    </Button>
  );
};

export default SpinnerButton;
