import { Col, Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useCallback } from "react";

const GroupTests = ({ group }) => {
  const testsInfo = useSelector((store) => {
    const groupTestsInfo = store.students.groupTestsInfo.filter(
      (gti) => gti.group_id === group.id
    );

    const tests = store.tests.workintechTests.filter((t) => {
      for (let i = 1; i < group.active_sprint; i++)
        if (t.name.includes(i.toString().padStart(2, 0))) return true;
      return false;
    });

    return tests.map((t) => {
      const testInfo = groupTestsInfo.find((gti) => gti.test_id === t.id);

      return { ...t, ...testInfo };
    });
  });

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
