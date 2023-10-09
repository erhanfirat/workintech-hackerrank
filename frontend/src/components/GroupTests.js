import { Col, Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
      const { id, name } = t;
      const testInfo = groupTestsInfo.find((gti) => gti.test_id === t.id);

      return {
        id,
        name,
        shortName: name?.replace("[Workintech] - ", ""),
        ...testInfo,
        attendee_rate: (
          (testInfo?.attendee_count / testInfo?.total_count) *
          100
        ).toFixed(0),
      };
    });
  });

  console.log(testsInfo);

  const TooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      console.log(payload);
      return (
        <div className="bg-white border rounded-1 p-3 shadow">
          <h4>{label}</h4>
          <Row className="border-top mt-2 pt-2">
            <Col sm="6">{payload[0].name}:</Col>
            <Col sm="6">{payload[0].value}%</Col>
          </Row>
          <Row className="border-top mt-2 pt-2">
            <Col sm="6">{payload[1].name}:</Col>
            <Col sm="6">{payload[1].value}%</Col>
          </Row>
          <Row>
            <Col sm="6"></Col>
            <Col sm="6">
              {payload[1].payload.attendee_count} /
              {payload[1].payload.total_count}
            </Col>
          </Row>
        </div>
      );
    }
  };

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
      <Row>
        <Col style={{ height: "400px" }} className="pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={testsInfo}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shortName" />
              <YAxis />
              <Tooltip content={<TooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="average_score"
                name="Ortalama"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="attendee_rate"
                stroke="#82ca9d"
                name="Katılım"
              />
            </LineChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default GroupTests;
