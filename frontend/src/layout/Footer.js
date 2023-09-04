import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

const Footer = () => {
  return (
    <footer className="page-footer p-3">
      <Container>
        <Row>
          <Col className="d-flex flex-column">
            <h5>Tests</h5>
            <Row className="border-top pt-2">
              <Col className="d-flex flex-column">
                <Link to="/">Sprint 01</Link>
                <Link to="/">Sprint 02</Link>
                <Link to="/">Sprint 03</Link>
                <Link to="/">Sprint 04</Link>
                <Link to="/">Sprint 05</Link>
                <Link to="/">Sprint 06</Link>
              </Col>
              <Col className="d-flex flex-column">
                <Link to="/">Sprint 07</Link>
                <Link to="/">Sprint 08</Link>
                <Link to="/">Sprint 09</Link>
                <Link to="/">Sprint 10</Link>
                <Link to="/">Sprint 11</Link>
                <Link to="/">Sprint 12</Link>
              </Col>
              <Col className="d-flex flex-column">
                <Link to="/">Sprint 13</Link>
                <Link to="/">Sprint 14</Link>
                <Link to="/">Sprint 15</Link>
                <Link to="/">Sprint 16</Link>
                <Link to="/">Sprint 17</Link>
                <Link to="/">Sprint 18</Link>
              </Col>
              <Col className="d-flex flex-column">
                <Link to="/">Sprint 19</Link>
                <Link to="/">Sprint 20</Link>
                <Link to="/">Sprint 21</Link>
                <Link to="/">Sprint 22</Link>
                <Link to="/">Sprint 23</Link>
                <Link to="/">Sprint 24</Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
