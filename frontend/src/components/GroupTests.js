import { Col, Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom";

const GroupTests = ({ group }) => {
  const tests = useSelector((state) =>
    state.tests.workintechTests.filter((t) => {
      for (let i = 1; i < group.active_sprint; i++)
        if (t.name.includes(i.toString().padStart(2, 0))) return true;
      return false;
    })
  );

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
            <Link to={`/tests/${test.id}/${group?.name.trim().toLowerCase()}`}>
              {test.name}
            </Link>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default GroupTests;
