import { Col, Container, Row } from "reactstrap";
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

const GroupTestsGraph = ({ group, testsInfo }) => {
  const TooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-1 p-3 shadow">
          <h4>{label}</h4>
          {payload[0] && payload[1] && (
            <>
              <Row className="border-top mt-2 pt-2">
                <Col sm="6">{payload[0]?.name}:</Col>
                <Col sm="6">{payload[0]?.value}%</Col>
              </Row>
              <Row className="border-top mt-2 pt-2">
                <Col sm="6">{payload[1]?.name}:</Col>
                <Col sm="6">{payload[1]?.value}%</Col>
              </Row>
              <Row>
                <Col sm="6"></Col>
                <Col sm="6">
                  {payload[1]?.payload.attendee_count} /
                  {payload[1]?.payload.total_count}
                </Col>
              </Row>
            </>
          )}
        </div>
      );
    }
  };

  return (
    <Container fluid>
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
                left: 0,
                bottom: 0,
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
                stroke="#06ca03"
                activeDot={{ r: 8 }}
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="attendee_rate"
                stroke="#2cbdff"
                name="Katılım"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default GroupTestsGraph;
