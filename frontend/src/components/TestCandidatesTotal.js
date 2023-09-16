import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Col, Container, Row } from "reactstrap";
import { downloadFile } from "../utils/utils";
import { useSelector } from "react-redux";
import { doHRRequest } from "../api/api";
import { hrEndpoints } from "../api/hrEndpoints";

const TestCandidatesTotal = ({
  candidates,
  sortIcon,
  inverseOrder,
  sortByState,
  ascState,
  testId,
}) => {
  const test = useSelector((state) =>
    state.tests.workintechTests.find((t) => t.id === testId)
  );

  const downloadPDF = (candidate) => {
    // download PDF of candidate
    // downloadFile(candidate.pdf_url, `${test.name}_${candidate.email}.pdf`);
    doHRRequest(hrEndpoints.getPDFReport(testId, candidate.id)).then(
      (pdfURL) => {
        console.log(pdfURL);
        window.open(pdfURL, "_blank");
      }
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col sm="2">
          <Link
            to={`/tests/${testId}/name/${
              sortByState === "name" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h6>
              {sortIcon("name", sortByState, ascState)}
              İsim
            </h6>
          </Link>
        </Col>
        <Col sm="3">
          <Link
            to={`/tests/${testId}/email/${
              sortByState === "email" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h6>
              {sortIcon("email", sortByState, ascState)}
              Email
            </h6>
          </Link>
        </Col>
        <Col sm="2">
          <Link
            to={`/tests/${testId}/start-date/${
              sortByState === "start-date" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h6>
              {sortIcon("start-date", sortByState, ascState)}
              Başlangıç Tar.
            </h6>
          </Link>
        </Col>
        <Col sm="2">
          <Link
            to={`/tests/${testId}/end-date/${
              sortByState === "end-date" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h6>
              {sortIcon("end-date", sortByState, ascState)}
              Bitiş Tar.
            </h6>
          </Link>
        </Col>
        <Col sm="1">
          <Link
            to={`/tests/${testId}/score/${
              sortByState === "score" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h6>{sortIcon("score", sortByState, ascState)}Sonuç %</h6>
          </Link>
        </Col>
        <Col sm="1">{/* <Button size="sm">All PDFs</Button> */}</Col>
      </Row>
      {candidates?.map((testCandidate) => (
        <Row key={testCandidate.id} className="border-top py-1 grid-row">
          <Col sm="2" className="text-truncate" title={testCandidate.full_name}>
            {testCandidate.full_name}
          </Col>
          <Col sm="3" className="text-truncate" title={testCandidate.email}>
            {testCandidate.email}
          </Col>
          <Col sm="2" className="text-truncate" title={testCandidate.email}>
            {testCandidate.startDateStr}
          </Col>
          <Col sm="2" className="text-truncate" title={testCandidate.email}>
            {testCandidate.endDateStr}
          </Col>
          <Col sm="2">{testCandidate.percentage_score}</Col>
          <Col sm="1">
            <Button
              size="sm"
              className="py-0"
              onClick={() => downloadPDF(testCandidate)}
            >
              PDF
            </Button>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default TestCandidatesTotal;
