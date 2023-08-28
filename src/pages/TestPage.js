import { useEffect, useState } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useRouteMatch } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import { FETCH_STATES } from "../store/reducers/testsReducer";
import { getAllCandidatesOfTestAction } from "../store/reducers/candidatesReducer";

const TestPage = () => {
  const { workintechTests } = useSelector((state) => state.tests);
  const { candidates, fetchStates } = useSelector((state) => state.candidates);

  const [testCandidates, setTestCandidates] = useState([]);
  const [test, setTest] = useState();
  const [sortByState, setSortByState] = useState("full_name");
  const [ascState, setAscState] = useState("asc");

  const dispatch = useDispatch();

  const { testId, sortBy, asc } = useParams();
  const { path, url } = useRouteMatch();

  const downloadPDF = (candidate) => {
    // download PDF of candidate
  };

  const downloadAllPDF = () => {
    // download PDF of candidate
  };

  const inverseOrder = (ord) => (ord === "asc" ? "desc" : "asc");

  const numberOrder = (ord) => (ord === "asc" ? 1 : -1);

  useEffect(() => {
    if (testId) {
      setTest(workintechTests.find((t) => t.id === testId));
      if (fetchStates[testId] !== FETCH_STATES.FETHCED) {
        dispatch(getAllCandidatesOfTestAction(testId));
      }
    }
  }, [workintechTests, testId]);

  useEffect(() => {
    setTestCandidates(candidates[testId]);
  }, [candidates]);

  useEffect(() => {
    setSortByState(sortBy || "full_name");
    setAscState(asc || "asc");
  }, [sortBy, asc]);

  return (
    <PageDefault pageTitle={test?.name}>
      <Container>
        <Row>
          <Col sm="4">
            <Link
              to={`/tests/${testId}/full_name/${
                sortByState === "full_name" ? inverseOrder(ascState) : ascState
              }`}
            >
              <h5>
                Name
                {sortByState === "full_name" && (
                  <i
                    class={`ps-1 fa-solid fa-chevron-${
                      ascState === "asc" ? "down" : "up"
                    }`}
                  ></i>
                )}
              </h5>
            </Link>
          </Col>
          <Col sm="4">
            <Link
              to={`/tests/${testId}/email/${
                sortByState === "email" ? inverseOrder(ascState) : ascState
              }`}
            >
              <h5>
                Email
                {sortByState === "email" && (
                  <i
                    class={`ps-1 fa-solid fa-chevron-${
                      ascState === "asc" ? "down" : "up"
                    }`}
                  ></i>
                )}
              </h5>
            </Link>
          </Col>
          <Col sm="2">
            <Link
              to={`/tests/${testId}/score/${
                sortByState === "score" ? inverseOrder(ascState) : ascState
              }`}
            >
              <h5>
                Score
                {sortByState === "score" && (
                  <i
                    class={`ps-1 fa-solid fa-chevron-${
                      ascState === "asc" ? "down" : "up"
                    }`}
                  ></i>
                )}
              </h5>
            </Link>
          </Col>
          <Col sm="2">
            <Button size="sm" onClick={() => downloadAllPDF()}>
              All PDFs
            </Button>
          </Col>
        </Row>
        {testCandidates
          ?.sort((tc1, tc2) =>
            tc1[sortBy] > tc2[sortBy]
              ? numberOrder(ascState) * 1
              : numberOrder(ascState) * -1
          )
          .map((testCandidate) => (
            <Row className="border-top p-1 grid-row">
              <Col sm="4">{testCandidate.full_name}</Col>
              <Col sm="4">{testCandidate.email}</Col>
              <Col sm="2">{testCandidate.score}</Col>
              <Col sm="2">
                <Button size="sm" onClick={() => downloadPDF(testCandidate)}>
                  PDF
                </Button>
              </Col>
            </Row>
          ))}
      </Container>
    </PageDefault>
  );
};

export default TestPage;
