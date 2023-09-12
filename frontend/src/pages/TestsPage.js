import { useEffect } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import {
  FETCH_STATES,
  fetchHRTestsAction,
  getAllTestsAction,
} from "../store/reducers/testsReducer";
import { Badge, Button, Col, Container, Row, Spinner } from "reactstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const TestsPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { allTests, workintechTests, fetchState } = useSelector(
    (state) => state.tests
  );

  const navigateToTest = (test) => {
    history.push(`/tests/${test.id}`);
  };

  const refetchTests = () => {
    dispatch(fetchHRTestsAction());
  };

  useEffect(() => {
    if (fetchState === FETCH_STATES.NOT_STARTED) {
      dispatch(getAllTestsAction());
    }
  }, []);

  return (
    <PageDefault pageTitle="Testler">
      <div className="text-end fs-6 fw-bold pb-3">
        <Badge color="warning" className="me-2">
          Loaded: {allTests.length}
        </Badge>
        <Badge color="warning" className="me-2">
          Workintech: {workintechTests.length}
        </Badge>
        <Button
          size="sm"
          color="primary"
          title="Eğer Hackkerrank testlerinde güncelleme olmadıysa bu işlemi başlatmayın!"
          onClick={refetchTests}
        >
          <i
            class={`fa-solid fa-rotate me-2 ${
              fetchState === FETCH_STATES.FETCHING ? " rotate" : ""
            }`}
          />
          Sync Tests with HR
        </Button>
      </div>
      <Container fluid>
        <Row>
          <Col sm="10">
            <h5>Name</h5>
          </Col>
          <Col sm="1">
            <h5>Duration</h5>
          </Col>
          <Col sm="1">
            <h5>Actions</h5>
          </Col>
        </Row>
        {workintechTests.map((test) => (
          <Row key={test.id} className="border-top p-1 grid-row">
            <Col sm="10">{test.name}</Col>
            <Col sm="1">{test.duration}</Col>
            <Col sm="1">
              <Button size="sm" onClick={() => navigateToTest(test)}>
                Open
              </Button>
            </Col>
          </Row>
        ))}
      </Container>
    </PageDefault>
  );
};

export default TestsPage;
