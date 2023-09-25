import { useCallback, useEffect, useState } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { utils, writeFile } from "xlsx";
import { FETCH_STATES } from "../utils/constants";
import {
  getAllGroupsActionCreator,
  getAllStudentsActionCreator,
} from "../store/reducers/studentsReducer";

const fields = {
  name: "full_name",
  email: "email",
};

const GroupPage = () => {
  const { groupName, sortBy, asc } = useParams();

  const group = useSelector((s) =>
    s.students.groups.find(
      (g) => g.name.toLowerCase() === groupName.toLowerCase()
    )
  );
  const students = useSelector((s) => s.students.students[group?.id]);
  const { groupsFetchState } = useSelector((s) => s.students);

  const [sortByState, setSortByState] = useState("full_name");
  const [ascState, setAscState] = useState("asc");
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState("students");

  const dispatch = useDispatch();

  const inverseOrder = (ord) => (ord === "asc" ? "desc" : "asc");
  const numberOrder = (ord) => (ord === "asc" ? 1 : -1);

  const getGeneralInfo = useCallback(() => {
    return {};
  });

  const sortIcon = useCallback((fieldName, sortByVal, ascVal) => {
    return (
      sortByVal === fieldName && (
        <i
          className={`ps-1 fa-solid fa-chevron-${
            ascVal === "asc" ? "down" : "up"
          }`}
        ></i>
      )
    );
  });

  const studentsToList = useCallback(() =>
    students?.sort((s1, s2) => (s1[sortByState] > s2[sortByState] ? 1 : -1))
  );

  const toggleTab = (tabId) => {
    setActiveTab(tabId);
  };

  const downloadCSV = () => {
    // CREATE WORKBOOK
    const wb = utils.book_new();

    // CREATE GENERAL SHEET
    const wsGeneral = utils.json_to_sheet([getGeneralInfo()]);

    // ADD SHEETS TO WORKBOOK
    utils.book_append_sheet(wb, wsGeneral, "General");

    writeFile(wb, `${group.name}.xlsx`);
  };

  useEffect(() => {
    if (groupName) {
      if (!group && groupsFetchState !== FETCH_STATES.NOT_STARTED) {
        dispatch(getAllGroupsActionCreator());
        dispatch(getAllStudentsActionCreator());
      }
    }
  }, [groupName]);

  useEffect(() => {
    setSortByState(sortBy || "name");
    setAscState(asc || "asc");
  }, [sortBy, asc]);

  return (
    <PageDefault pageTitle={group?.title}>
      <div className="pt-3 pb-2">
        <div className="d-flex">
          <Input
            type="text"
            className="me-2"
            placeholder="Type to filter"
            onChange={(e) => setFilterText(e.target.value)}
          ></Input>

          <Button className="text-nowrap" onClick={downloadCSV}>
            Download CSV
          </Button>
        </div>
      </div>

      <Nav tabs className="mt-2">
        <NavItem>
          <NavLink
            className={`${activeTab === "students" ? "active" : ""}`}
            onClick={() => toggleTab("students")}
          >
            Öğrenciler
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent
        activeTab={activeTab}
        className="px-2 py-3 border-start border-bottom border-end"
      >
        <TabPane tabId="students">
          <Container fluid>
            <Row className="pb-1 mb-2">
              <Col sm="3">İsim</Col>
              <Col sm="3">Eposta</Col>
              <Col sm="3">HR Eposta</Col>
              <Col sm="3"></Col>
            </Row>
            {studentsToList().map((student) => (
              <Row className="border-top py-1 grid-row">
                <Col sm="3">{student.name}</Col>
                <Col sm="3">{student.email}</Col>
                <Col sm="3">{student.hrEmail}</Col>
                <Col sm="3" className="text-right">
                  <Button> HR Eposta</Button>
                </Col>
              </Row>
            ))}
          </Container>
        </TabPane>
      </TabContent>
    </PageDefault>
  );
};

export default GroupPage;
