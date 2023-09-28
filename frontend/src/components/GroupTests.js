import { Col, Container, Row } from "reactstrap";
import { useSelector } from "react-redux";

const GroupTests = ({ group }) => {
  const tests = useSelector((state) =>
    state.tests.workintechTests.filter((t) => {
      for (let i = 1; i < group.active_sprint; i++)
        if (t.name.includes(i.toString().padStart(2, 0))) return true;
      return false;
    })
  );

  console.log("tests of the group > ", tests);

  return (
    <Container fluid>
      <Row>
        <Col>
          <h6>İsim</h6>
        </Col>
      </Row>
      {tests?.map((test) => (
        <Row key={test.id} className="border-top py-1 grid-row">
          <Col className="text-truncate" title={test.name}>
            {test.name}
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default GroupTests;
