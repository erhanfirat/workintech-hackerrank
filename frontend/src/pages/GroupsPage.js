import { useEffect } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button, Col, Container, Row } from "reactstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FETCH_STATES } from "../utils/constants";
import {
  fetchGroupsAndStudents,
  getAllGroupsActionCreator,
} from "../store/reducers/studentsReducer";
import SpinnerButton from "../components/atoms/SpinnerButton";

const GroupsPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { groups, groupsFetchState, students, studentsFetchState } =
    useSelector((state) => state.students);

  const navigateToGroup = (group) => {
    history.push(`/groups/${group.name.toLowerCase()}`);
  };

  const refetchGroupsAndStudents = () => {
    dispatch(fetchGroupsAndStudents());
  };

  useEffect(() => {
    if (groupsFetchState === FETCH_STATES.NOT_STARTED) {
      dispatch(getAllGroupsActionCreator());
    }
  }, []);

  return (
    <PageDefault pageTitle="Gruplar">
      <div className="text-end fs-6 fw-bold pb-2">
        <Badge color="warning" className="me-2">
          Groups: {groups.length}
        </Badge>
        <SpinnerButton
          loading={groupsFetchState === FETCH_STATES.FETCHING}
          iconClass={"fa-solid fa-rotate me-2"}
          size="sm"
          color="primary"
          title="Eğer Hackkerrank testlerinde güncelleme olmadıysa bu işlemi başlatmayın!"
          onClick={refetchGroupsAndStudents}
        >
          Sync Groups & Students with Journey
        </SpinnerButton>
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
        {groups.map((group) => (
          <Row className="border-top p-1 grid-row">
            <Col sm="5">{group.title}</Col>
            <Col sm="2">{group.name}</Col>
            <Col sm="2">{group.active_sprint}</Col>
            <Col sm="2">{students[group.id]?.length}</Col>
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
