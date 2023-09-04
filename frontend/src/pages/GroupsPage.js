import { useEffect } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import {
  FETCH_STATES,
  getAllTestsAction,
} from "../store/reducers/testsReducer";
import { Badge, Button, Col, Container, Row } from "reactstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const GroupsPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { total, allTests, workintechTests, fetchState } = useSelector(
    (state) => state.tests
  );

  const navigateToTest = (test) => {
    history.push(`/tests/${test.id}`);
  };

  useEffect(() => {
    if (fetchState === FETCH_STATES.NOT_STARTED) {
      dispatch(getAllTestsAction());
    }
  }, []);

  return (
    <PageDefault pageTitle="Testler">
      <div className="text-end fs-6 fw-bold pb-2">
        [Total: {total} | Loaded: {allTests.length} | Workintech:
        {workintechTests.length}]
      </div>
      <Container>
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
          <Row className="border-top p-1 grid-row">
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

export default GroupsPage;
