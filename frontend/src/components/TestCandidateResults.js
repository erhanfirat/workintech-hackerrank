import { Col, Container, Row } from "reactstrap";
import { getCleanTestName, getDateTimeStringFromISO } from "../utils/utils";

export const TestCandidateResults = ({
  test,
  candidates,
  selectedGroup,
  getGroupNameByEmail,
}) => {
  return (
    <Container fluid className="test-candidate-results">
      <Row className="border-bottom fw-bold flex-nowrap">
        <Col
          sm="2"
          className="text-truncate border-right border-end"
          title={test?.name}
        >
          <h6>{getCleanTestName(test?.name)}</h6>
        </Col>
        {selectedGroup === "all" && (
          <Col sm="1" className="text-truncate border-right border-end">
            <h6>Grup</h6>
          </Col>
        )}
        <Col sm="2" className="text-truncate border-right border-end">
          <h6>Tarih</h6>
        </Col>
        <Col sm="1" title="Score in percentage">
          <h6>S %</h6>
        </Col>
        {test?.questions.map((question, i) => (
          <Col key={`Q${i}`}>
            <h6>{`Q${i + 1}`}</h6>
          </Col>
        ))}
      </Row>
      {candidates?.map((candidate, j) => (
        <Row key={`Candidate${j}`} className="border-bottom flex-nowrap py-1 ">
          <Col
            sm="2"
            className="text-truncate border-end"
            title={candidate.email}
          >
            {candidate.email}
          </Col>
          {selectedGroup === "all" && (
            <Col
              sm="1"
              className="text-truncate border-right border-end"
              title={getGroupNameByEmail(candidate.email)}
            >
              {getGroupNameByEmail(candidate.email)}
            </Col>
          )}
          <Col sm="2" className="text-truncate border-right border-end">
            {getDateTimeStringFromISO(candidate.attempt_starttime)}
          </Col>
          <Col sm="1">{parseInt(candidate.percentage_score)}</Col>
          {test.questions.map((question, i) => (
            <Col  key={`QA${i}`}>
              {candidate.questions[question]?.toFixed(1)}
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};
