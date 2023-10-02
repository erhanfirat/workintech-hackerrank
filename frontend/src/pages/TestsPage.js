import { useCallback, useEffect } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHRTestsAction,
  getAllTestsAction,
} from "../store/reducers/testsReducer";
import { Badge, Button, Col, Container, Row, Spinner } from "reactstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FETCH_STATES } from "../utils/constants";
import SpinnerButton from "../components/atoms/SpinnerButton";
import { fetchAllCandidatesOfTestAction } from "../store/reducers/candidatesReducer";

const TestsPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { allTests, workintechTests, fetchState } = useSelector(
    (state) => state.tests
  );
  const candidateFetchStates = useSelector((s) => s.candidates.fetchStates);

  const navigateToTest = (test) => {
    history.push(`/tests/${test.id}/all`);
  };

  const refetchTests = () => {
    dispatch(fetchHRTestsAction());
  };

  const refetchAllCandidates = () => {
    workintechTests.forEach((witTest) => {
      // fetch candidates for the test
      dispatch(fetchAllCandidatesOfTestAction(witTest.id));
    });
  };

  const witTestCandidatesFetchState = useCallback(() => {
    for (let i = 0; i < workintechTests.length; i++) {
      if (
        candidateFetchStates[workintechTests[i]?.id] === FETCH_STATES.FETCHING
      )
        return true;
    }
    return false;
  });

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
        <SpinnerButton
          loading={fetchState === FETCH_STATES.FETCHING}
          iconClass={"fa-solid fa-rotate me-2"}
          size="sm"
          className="me-2"
          color="primary"
          title="Eğer Hackkerrank testlerinde güncelleme olmadıysa bu işlemi başlatmayın!"
          onClick={refetchTests}
        >
          Sync Tests with HR
        </SpinnerButton>
        <SpinnerButton
          loading={witTestCandidatesFetchState()}
          iconClass={"fa-solid fa-rotate me-2"}
          size="sm"
          color="primary"
          title="Eğer Hackkerrank testlerinde güncelleme olmadıysa bu işlemi başlatmayın!"
          onClick={refetchAllCandidates}
        >
          Sync All Candidates
        </SpinnerButton>
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
