import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Col, Container, Row } from "reactstrap";
import { downloadFile } from "../utils/utils";

const TestCandidatesTotal = ({
  candidates,
  sortIcon,
  inverseOrder,
  sortByState,
  ascState,
  testId,
}) => {
  const downloadPDF = (candidate) => {
    // download PDF of candidate
    downloadFile(candidate.pdf_url, `${test.name}_${candidate.email}.pdf`);
  };

  return (
    <Container fluid>
      <Row>
        <Col sm="4">
          <Link
            to={`/tests/${testId}/name/${
              sortByState === "name" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h5>
              Name
              {sortIcon("name", sortByState, ascState)}
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
              {sortIcon("email", sortByState, ascState)}
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
              Score %
              {sortIcon("score", sortByState, ascState)}
            </h5>
          </Link>
        </Col>
        <Col sm="2">
          <Button size="sm">All PDFs</Button>
        </Col>
      </Row>
      {candidates?.map((testCandidate) => (
        <Row key={testCandidate.id} className="border-top p-1 grid-row">
          <Col sm="4" className="text-truncate" title={testCandidate.full_name}>
            {testCandidate.full_name}
          </Col>
          <Col sm="4" className="text-truncate" title={testCandidate.email}>
            {testCandidate.email}
          </Col>
          <Col sm="2">{testCandidate.percentage_score}</Col>
          <Col sm="2">
            <Button size="sm" onClick={() => downloadPDF(testCandidate)}>
              PDF
            </Button>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default TestCandidatesTotal;
