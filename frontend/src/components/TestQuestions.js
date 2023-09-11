import { useSelector } from "react-redux";
import { Badge, Col, Container, Row } from "reactstrap";

const TestQuestions = ({ testId, testQuestions = [] }) => {
  const questions = useSelector(
    (state) => state.questions.testQuestions[testId]
  );
  return (
    <Container fluid>
      <Row>
        <Col sm="4">
          <h5>Name</h5>
        </Col>
      </Row>
      {testQuestions?.map((questionId, i) => {
        const question = questions && questions[questionId];
        if (question)
          return (
            <Row key={question.id} className="border-top p-1 grid-row">
              <Col sm="2" className="" title={question.name}>
                <div className="fw-bold pb-2">Q {i + 1}</div>
                <div className="pb-2">{question.name}</div>
                <div className="d-flex flex-wrap align-items-start align-self-start">
                  {question.tags?.map((t) => (
                    <Badge
                      className="text-truncate me-1 mb-1"
                      color="secondary"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </Col>
              <Col sm="10">
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: question.problem_statement,
                  }}
                ></div>
              </Col>
            </Row>
          );
        else return "";
      })}
    </Container>
  );
};

export default TestQuestions;
