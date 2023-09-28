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
import SpinnerButton from "../components/atoms/SpinnerButton";
import { utils, writeFile } from "xlsx";
import { FETCH_STATES } from "../utils/constants";
import {
  getAllGroupsActionCreator,
  updateStudentAction,
} from "../store/reducers/studentsReducer";
import { doSRRequest } from "../api/api";
import { srEndpoints } from "../api/srEndpoints";

const fields = {
  name: "full_name",
  email: "email",
};

const GroupPage = () => {
  const { groupName, sortBy, asc } = useParams();
  const { groups } = useSelector((s) => s.students);

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
  const [hrEmails, setHrEmails] = useState([]);

  const dispatch = useDispatch();

  const inverseOrder = (ord) => (ord === "asc" ? "desc" : "asc");
  const numberOrder = (ord) => (ord === "asc" ? 1 : -1);

  const getGroupNameById = useCallback(
    (groupId) => groups.find((g) => g.id == groupId)?.title
  );

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
    students
      ?.filter(
        (s) =>
          s.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
          s.email
            .toLocaleLowerCase()
            .includes(filterText.toLocaleLowerCase()) ||
          s.hrEmail
            ?.toLocaleLowerCase()
            .includes(filterText.toLocaleLowerCase())
      )
      .sort((s1, s2) => (s1[sortByState] > s2[sortByState] ? 1 : -1))
  );

  const toggleTab = (tabId) => {
    setActiveTab(tabId);
  };

  const studentHREmailChange = (student, e) => {
    setHrEmails({
      ...hrEmails,
      [student.id]: {
        ...hrEmails[student.id],
        hrEmail: e.target.value,
      },
    });
  };

  const saveHrEmail = (student) => {
    // save hr email
    setHrEmails({
      ...hrEmails,
      [student.id]: {
        ...hrEmails[student.id],
        loading: true,
      },
    });
    doSRRequest(
      srEndpoints.setStudentHREmail({
        student: student.id,
        email: hrEmails[student.id].hrEmail,
      })
    )
      .then((res) => {
        setHrEmails({
          ...hrEmails,
          [student.id]: {
            ...hrEmails[student.id],
            editMode: false,
          },
        });
        dispatch(
          updateStudentAction({
            ...student,
            hrEmail: hrEmails[student.id].hrEmail,
          })
        );
      })
      .finally(() => {
        setHrEmails({
          ...hrEmails,
          [student.id]: {
            ...hrEmails[student.id],
            loading: false,
          },
        });
      });
  };

  const cancelEditMode = (student) => {
    setHrEmails({
      ...hrEmails,
      [student.id]: {
        student: student.id,
        hrEmail: student.hrEmail,
        editMode: false,
        loading: false,
      },
    });
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
      if (!group && groupsFetchState === FETCH_STATES.NOT_STARTED) {
        dispatch(getAllGroupsActionCreator());
      }
    }
  }, [groupName]);

  useEffect(() => {
    setHrEmails(() => {
      const hrStudents = {};
      students?.forEach((s) => {
        const hrStudent = hrEmails[s.id]
          ? hrEmails[s.id]
          : {
              student: s.id,
              hrEmail: s.hrEmail,
              editMode: false,
              loading: false,
            };
        hrStudents[s.id] = hrStudent;
      });
      return hrStudents;
    });
  }, [students]);

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
              <Col>
                <h5>İsim</h5>
              </Col>
              {groupName === "all" && (
                <Col>
                  <h5>Grup</h5>
                </Col>
              )}
              <Col>
                <h5>Eposta</h5>
              </Col>
              <Col>
                <h5>HR Eposta</h5>
              </Col>
            </Row>
            {studentsToList()?.map((student) => (
              <Row className="border-top py-1 grid-row" key={student.id}>
                <Col>{student.name}</Col>
                {groupName === "all" && (
                  <Col>{getGroupNameById(student.group)}</Col>
                )}
                <Col>{student.email}</Col>
                <Col>
                  <div className="d-flex justify-content-between gap-1">
                    {!hrEmails[student.id]?.editMode ? (
                      <>
                        <span>{student.hrEmail}</span>
                        <SpinnerButton
                          iconClass="fa-solid fa-pen-to-square"
                          onClick={() =>
                            setHrEmails({
                              ...hrEmails,
                              [student.id]: {
                                ...hrEmails[student.id],
                                editMode: true,
                              },
                            })
                          }
                        ></SpinnerButton>
                      </>
                    ) : (
                      <>
                        <Input
                          type="email"
                          value={hrEmails[student.id].hrEmail}
                          onChange={(e) => studentHREmailChange(student, e)}
                        />
                        <SpinnerButton
                          iconClass="fa-solid fa-floppy-disk"
                          onClick={() => saveHrEmail(student)}
                          loading={hrEmails[student.id].loading}
                        ></SpinnerButton>
                        <SpinnerButton
                          iconClass="fa-solid fa-xmark"
                          color="danger"
                          onClick={() => cancelEditMode(student)}
                        ></SpinnerButton>
                      </>
                    )}
                  </div>
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
