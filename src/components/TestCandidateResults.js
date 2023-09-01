import { Col, Container, Row } from "reactstrap";

export const TestCandidateResults = ({ test, candidates }) => {
  return (
    <Container fluid className="test-candidate-results">
      <Row className="border-bottom fw-bold flex-nowrap">
        <Col
          sm="3"
          className="text-truncate border-right border-end"
          title={test?.name}
        >
          {test?.name}
        </Col>
        <Col sm="1">T %</Col>
        {test?.questions.map((question, i) => (
          <Col key={`Q${i}`} sm="1">{`Q${i + 1}`}</Col>
        ))}
      </Row>
      {candidates?.map((candidate, j) => (
        <Row key={`Candidate${j}`} className="border-bottom flex-nowrap">
          <Col
            sm="3"
            className="text-truncate border-end fw-bold"
            title={candidate.email}
          >
            {candidate.email}
          </Col>
          <Col sm="1">{parseInt(candidate.percentage_score)}</Col>
          {test.questions.map((question, i) => (
            <Col sm="1" key={`QA${i}`}>
              {candidate.questions[question]}
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};
