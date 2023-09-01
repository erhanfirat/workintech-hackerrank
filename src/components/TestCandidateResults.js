import { Col, Container, Row } from "reactstrap";

export const TestCandidateResults = ({ test, candidates }) => {
  return (
    <Container fluid className="test-candidate-results">
      <h3>Candidate Results Per Question</h3>
      <Row className="border-bottom fw-bold">
        <Col
          sm="2"
          className="text-truncate border-right border-end"
          title={test?.name}
        >
          {test?.name}
        </Col>
        <Col sm="10">
          <Row>
            <Col className="">T %</Col>
            {test?.questions.map((question, i) => (
              <Col key={`Q${i}`} className="">{`Q${i + 1}`}</Col>
            ))}
          </Row>
        </Col>
      </Row>
      {candidates?.map((candidate, j) => (
        <Row key={`Candidate${j}`} className="border-bottom">
          <Col
            sm="2"
            className="text-truncate border-end fw-bold"
            title={candidate.email}
          >
            {candidate.email}
          </Col>
          <Col sm="10">
            <Row>
              <Col>{parseInt(candidate.percentage_score)}</Col>
              {test.questions.map((question, i) => (
                <Col key={`QA${i}`}>{candidate.questions[question]}</Col>
              ))}
            </Row>
          </Col>
        </Row>
      ))}
    </Container>
  );
};
