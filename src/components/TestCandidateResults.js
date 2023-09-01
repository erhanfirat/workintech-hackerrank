import { Col, Container, Row } from "reactstrap";

export const TestCandidateResults = ({ test, candidates }) => {
  return (
    <Container fluid>
      <h3>Candidate Results Per Question</h3>
      <Row>
        <Col>{test?.name}</Col>
        {test?.questions.map((question, i) => (
          <Col key={`Q${i}`}>{i}</Col>
        ))}
      </Row>
      {candidates?.map((candidate, j) => (
        <Row key={`Candidate${j}`}>
          <Col>{candidate.email}</Col>
          {test.questions.map((question, i) => (
            <Col key={`QA${i}`}>{candidate.questions[question]}</Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};
