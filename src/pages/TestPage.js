import { useEffect, useState } from "react";
import PageDefault from "./PageDefault";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Container } from "reactstrap";

const TestPage = () => {
  const { workintechTests } = useSelector((state) => state.tests);
  const { testId } = useParams();

  const [test, setTest] = useState();

  useEffect(() => {
    if (testId) {
      setTest(workintechTests.find((t) => t.id === testId));
    }
  }, [workintechTests, testId]);

  return (
    <PageDefault pageTitle={test?.name}>
      <Container></Container>
    </PageDefault>
  );
};

export default TestPage;
