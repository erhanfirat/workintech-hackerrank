import { useEffect } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTestsAction,
} from "../store/reducers/testsReducer";
import { Badge, Button, Col, Container, Row } from "reactstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { studentGroups, students } from "../data/studentGroups";
import { FETCH_STATES } from "../utils/constants";

const GroupsPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { total, allTests, workintechTests, fetchState } = useSelector(
    (state) => state.tests
  );

  const navigateToGroup = (group) => {
    history.push(`/groups/${group.value}`);
  };

  useEffect(() => {
    if (fetchState === FETCH_STATES.NOT_STARTED) {
      dispatch(getAllTestsAction());
    }
  }, []);

  return (
    <PageDefault pageTitle="Gruplar">
      <div className="text-end fs-6 fw-bold pb-2">
        [Total: {studentGroups.length}]
      </div>
      <Container fluid>
        <Row>
          <Col sm="5">
            <h5>Name</h5>
          </Col>
          <Col sm="2">
            <h5>Code</h5>
          </Col>
          <Col sm="2">
            <h5>Active Sprint</h5>
          </Col>
          <Col sm="2">
            <h5>Students Count</h5>
          </Col>
          <Col sm="1">
            <h5>Actions</h5>
          </Col>
        </Row>
        {studentGroups.map((group) => (
          <Row className="border-top p-1 grid-row">
            <Col sm="5">{group.name}</Col>
            <Col sm="2">{group.value}</Col>
            <Col sm="2"></Col>
            <Col sm="2">{students[group.value]?.length}</Col>
            <Col sm="1">
              <Button size="sm" onClick={() => navigateToGroup(group)}>
                Open
              </Button>
            </Col>
          </Row>
        ))}
      </Container>
    </PageDefault>
  );
};

export default GroupsPage;
