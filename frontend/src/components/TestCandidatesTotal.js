import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Col, Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { doHRRequest, doSRRequest } from "../api/api";
import { hrEndpoints } from "../api/hrEndpoints";
import { srEndpoints } from "../api/srEndpoints";

const TestCandidatesTotal = ({
  candidates,
  sortIcon,
  inverseOrder,
  sortByState,
  ascState,
  testId,
  groupCode,
  getGroupNameByEmail,
}) => {
  const test = useSelector((state) =>
    state.tests.workintechTests.find((t) => t.id === testId)
  );

  const downloadPDF = (candidate) => {
    // download PDF of candidate
    // downloadFile(candidate.pdf_url, `${test.name}_${candidate.email}.pdf`);
    doHRRequest(hrEndpoints.getPDFReport(testId, candidate.id)).then(
      (pdfURL) => {
        window.open(pdfURL, "_blank");
      }
    );
  };

  const emailPDFReport = (candidate) => {
    // download PDF of candidate
    // downloadFile(candidate.pdf_url, `${test.name}_${candidate.email}.pdf`);
    doHRRequest(hrEndpoints.getPDFReport(testId, candidate.id)).then(
      (pdfURL) => {
        doSRRequest(
          srEndpoints.candidateSendReport([
            {
              url: pdfURL,
              studentId: candidate.student_id,
              testId,
            },
          ])
        );
      }
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Link
            to={`/tests/${testId}/${groupCode}/name/${
              sortByState === "name" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h6>
              {sortIcon("name", sortByState, ascState)}
              İsim
            </h6>
          </Link>
        </Col>
        <Col>
          <Link
            to={`/tests/${testId}/${groupCode}/email/${
              sortByState === "email" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h6>
              {sortIcon("email", sortByState, ascState)}
              Email
            </h6>
          </Link>
        </Col>
        {groupCode === "all" && (
          <Col>
            <Link
              to={`/tests/${testId}/${groupCode.toLowerCase()}/group/${
                sortByState === "group" ? inverseOrder(ascState) : ascState
              }`}
            >
              <h6>
                {sortIcon("group", sortByState, ascState)}
                Group
              </h6>
            </Link>
          </Col>
        )}
        <Col>
          <Link
            to={`/tests/${testId}/${groupCode}/start-date/${
              sortByState === "start-date" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h6>
              {sortIcon("start-date", sortByState, ascState)}
              Başlangıç Tar.
            </h6>
          </Link>
        </Col>
        <Col>
          <Link
            to={`/tests/${testId}/${groupCode}/end-date/${
              sortByState === "end-date" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h6>
              {sortIcon("end-date", sortByState, ascState)}
              Bitiş Tar.
            </h6>
          </Link>
        </Col>
        <Col sm="1">
          <Link
            to={`/tests/${testId}/${groupCode}/score/${
              sortByState === "score" ? inverseOrder(ascState) : ascState
            }`}
          >
            <h6>{sortIcon("score", sortByState, ascState)}Sonuç %</h6>
          </Link>
        </Col>
        <Col sm="2">
          <h6>Actions</h6>
        </Col>
      </Row>
      {candidates?.map((testCandidate) => (
        <Row key={testCandidate.id} className="border-top py-1 grid-row">
          <Col className="text-truncate" title={testCandidate.full_name}>
            {testCandidate.full_name}
          </Col>
          <Col className="text-truncate" title={testCandidate.email}>
            {testCandidate.email}
          </Col>
          {groupCode === "all" && (
            <Col className="text-truncate" title={testCandidate.email}>
              {getGroupNameByEmail(testCandidate.email)}
            </Col>
          )}
          <Col className="text-truncate" title={testCandidate.email}>
            {testCandidate.startDateStr}
          </Col>
          <Col className="text-truncate" title={testCandidate.email}>
            {testCandidate.endDateStr}
          </Col>
          <Col sm="1">{testCandidate.percentage_score}</Col>
          <Col sm="2">
            <Button
              size="sm"
              className="py-0 me-2"
              onClick={() => downloadPDF(testCandidate)}
              title={`Download PDF report of ${testCandidate.full_name}`}
            >
              <i className="fa-solid fa-file-arrow-down me-2"></i>
              PDF
            </Button>
            <Button
              size="sm"
              className="py-0"
              onClick={() => emailPDFReport(testCandidate)}
              title={`Send email with PDF Report to ${testCandidate.full_name}`}
            >
              <i className="fa-solid fa-envelope me-2"></i>
              PDF
            </Button>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default TestCandidatesTotal;
