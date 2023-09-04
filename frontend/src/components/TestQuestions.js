import { useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Col, Container, Row } from "reactstrap";

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
        const question = questions[questionId];
        if (question)
          return (
            <Row key={question.id} className="border-top p-1 grid-row">
              <Col sm="1">Q {i + 1}</Col>
              <Col sm="2" className="text-truncate" title={question.name}>
                {question.name}
              </Col>
              <Col sm="9">
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
