import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom/cjs/react-router-dom";

const GroupTests = ({ group, testsInfo }) => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <h6>İsim</h6>
        </Col>
        <Col>
          <h6>Ortalama</h6>
        </Col>
        <Col>
          <h6>Katılım Sayısı</h6>
        </Col>
      </Row>
      {testsInfo?.map((test) => (
        <Row key={test.id} className="border-top py-1 grid-row">
          <Col className="text-truncate" title={test.name}>
            <Link to={`/tests/${test.id}/${group?.name.trim().toLowerCase()}`}>
              {test.name}
            </Link>
          </Col>
          <Col>{test.average_score}</Col>
          <Col>
            {test.attendee_count} / {test.total_count}
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default GroupTests;
