import { Col, Container, Row } from "reactstrap";
import { getCleanTestName, getDateTimeStringFromISO } from "../utils/utils";

export const TestCandidateResults = ({ test, candidates }) => {
  return (
    <Container fluid className="test-candidate-results">
      <Row className="border-bottom fw-bold flex-nowrap">
        <Col
          sm="3"
          className="text-truncate border-right border-end"
          title={test?.name}
        >
          {getCleanTestName(test?.name)}
        </Col>
        <Col sm="2" className="text-truncate border-right border-end">
          Tarih
        </Col>
        <Col sm="1" title="Score in percentage">
          S %
        </Col>
        {test?.questions.map((question, i) => (
          <Col key={`Q${i}`} sm="1">{`Q${i + 1}`}</Col>
        ))}
      </Row>
      {candidates?.map((candidate, j) => (
        <Row key={`Candidate${j}`} className="border-bottom flex-nowrap">
          <Col
            sm="3"
            className="text-truncate border-end"
            title={candidate.email}
          >
            {candidate.email}
          </Col>
          <Col sm="2" className="text-truncate border-right border-end">
            {getDateTimeStringFromISO(candidate.attempt_starttime)}
          </Col>
          <Col sm="1">{parseInt(candidate.percentage_score)}</Col>
          {test.questions.map((question, i) => (
            <Col sm="1" key={`QA${i}`}>
              {candidate.questions[question]?.toFixed(1)}
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};
