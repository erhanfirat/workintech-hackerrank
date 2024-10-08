import { useSelector } from "react-redux";
import { Badge, Col, Container, Row } from "reactstrap";

const TestQuestions = ({ testId, testQuestions = [] }) => {
  const questions = useSelector(
    (state) => state.questions.testQuestions[testId]
  );
  return (
    <Container fluid>
      <Row>
        <Col sm="2">
          <h6>Soru</h6>
        </Col>
        <Col sm="8">
          <h6>Açıklama Metni</h6>
        </Col>
        <Col sm="2">
          <h6>Seçenekler</h6>
        </Col>
      </Row>
      {testQuestions?.map((questionId, i) => {
        const question = questions && questions[questionId];
        if (question)
          return (
            <Row key={question.id} className="border-top p-1 grid-row">
              <Col sm="2" className="fs-7" title={question.name}>
                <div className="fw-bold pb-2">Q {i + 1}</div>
                <div className="pb-2">{question.name}</div>
                <div className="d-flex flex-wrap align-items-start align-self-start">
                  {question.tags?.map((t, j) => (
                    <Badge
                      key={`tag-${j}`}
                      className="text-truncate me-1 mb-1"
                      color="secondary"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </Col>
              <Col sm={question?.options ? "8" : "10"}>
                <div
                  className="content fs-7 overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: question.problem_statement,
                  }}
                ></div>
              </Col>
              {question?.options && (
                <Col sm="2" className="fs-7">
                  <ol className="m-0 ps-3 overflow-hidden">
                    {question?.options?.map((option, k) => (
                      <li
                        key={`option-${k}`}
                        className="option-li"
                        // EF: Some options needs to be rendered as HTML, somes are not!
                        // dangerouslySetInnerHTML={{ __html: option }}
                      >
                        {option}
                      </li>
                    ))}
                  </ol>
                  <div>
                    <strong>Cevap: {question?.answer?.toString()}</strong>
                  </div>
                </Col>
              )}
            </Row>
          );
        else return "";
      })}
    </Container>
  );
};

export default TestQuestions;
