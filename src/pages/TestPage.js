import { useEffect, useState } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useRouteMatch } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import { FETCH_STATES } from "../store/reducers/testsReducer";
import { getAllCandidatesOfTestAction } from "../store/reducers/candidatesReducer";
import { downloadFile } from "../utils/utils";

const fields = {
  name: "full_name",
  email: "email",
  score: "percentage_score",
};

const TestPage = () => {
  const { workintechTests } = useSelector((state) => state.tests);
  const { candidates, fetchStates } = useSelector((state) => state.candidates);

  const [testCandidates, setTestCandidates] = useState([]);
  const [test, setTest] = useState();
  const [sortByState, setSortByState] = useState("full_name");
  const [ascState, setAscState] = useState("asc");

  const dispatch = useDispatch();

  const { testId, sortBy, asc } = useParams();

  const downloadPDF = (candidate) => {
    // download PDF of candidate
    downloadFile(candidate.pdf_url, `${test.name}_${candidate.email}.pdf`);
  };

  const downloadAllPDF = () => {
    // download PDF of candidate
    console.log("download all ");

    testCandidates.forEach((candidate) => {
      console.log("download for ", candidate);
      // downloadFile(candidate.pdf_url, `${test.name}_${candidate.email}.pdf`);
      // window.open(candidate.pdf_url, "_blank");
      let iframe = document.createElement("iframe");
      iframe.style.visibility = "collapse";
      document.body.append(iframe);

      iframe.contentDocument.write(
        `<form action="${candidate.pdf_url.replace(
          /\"/g,
          '"'
        )}" method="GET"></form>`
      );
      iframe.contentDocument.forms[0].submit();

      setTimeout(() => iframe.remove(), 2000);
    });
  };

  const inverseOrder = (ord) => (ord === "asc" ? "desc" : "asc");

  const numberOrder = (ord) => (ord === "asc" ? 1 : -1);

  const calculateAverages = () => {
    const avr =
      testCandidates.reduce(
        (total, student) => total + student.percentage_score,
        0
      ) / testCandidates.length;
  };

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
    calculateAverages();
  }, [testCandidates]);

  useEffect(() => {
    setSortByState(sortBy || "name");
    setAscState(asc || "asc");
  }, [sortBy, asc]);

  return (
    <PageDefault pageTitle={test?.name}>
      <Container>
        <Row>
          <Col sm="4">
            <Link
              to={`/tests/${testId}/name/${
                sortByState === "name" ? inverseOrder(ascState) : ascState
              }`}
            >
              <h5>
                Name
                {sortByState === "name" && (
                  <i
                    className={`ps-1 fa-solid fa-chevron-${
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
                    className={`ps-1 fa-solid fa-chevron-${
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
                    className={`ps-1 fa-solid fa-chevron-${
                      ascState === "asc" ? "down" : "up"
                    }`}
                  ></i>
                )}
              </h5>
            </Link>
          </Col>
          <Col sm="2">
            <Button size="sm" onClick={downloadAllPDF}>
              All PDFs
            </Button>
          </Col>
        </Row>
        {testCandidates
          ?.sort((tc1, tc2) =>
            (
              sortByState === "score"
                ? tc1[fields[sortByState]] > tc2[fields[sortByState]]
                : tc1[fields[sortByState]].toLocaleLowerCase() >
                  tc2[fields[sortByState]].toLocaleLowerCase()
            )
              ? numberOrder(ascState) * 1
              : numberOrder(ascState) * -1
          )
          .map((testCandidate) => (
            <Row key={testCandidate.id} className="border-top p-1 grid-row">
              <Col sm="4">{testCandidate.full_name}</Col>
              <Col sm="4">{testCandidate.email}</Col>
              <Col sm="2">{testCandidate.percentage_score}</Col>
              <Col sm="2">
                <Button size="sm" onClick={() => downloadPDF(testCandidate)}>
                  PDF
                </Button>
              </Col>
            </Row>
          ))}
      </Container>
      <Container>
        <Row>
          <Col>Ortalama</Col>
        </Row>
      </Container>
    </PageDefault>
  );
};

export default TestPage;
