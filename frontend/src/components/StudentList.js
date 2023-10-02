import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Input, Row } from "reactstrap";
import { doSRRequest } from "../api/api";
import { srEndpoints } from "../api/srEndpoints";
import SpinnerButton from "./atoms/SpinnerButton";
import { useCallback, useEffect, useState } from "react";
import { updateStudentAction } from "../store/reducers/studentsReducer";

const StudentList = ({ students, groupName }) => {
  const { groups } = useSelector((s) => s.students);
  const dispatch = useDispatch();
  const [hrEmails, setHrEmails] = useState([]);

  const getGroupNameById = useCallback(
    (groupId) => groups.find((g) => g.id == groupId)?.title
  );

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
        setHrEmails((oldHrEmails) => ({
          ...oldHrEmails,
          [student.id]: {
            ...oldHrEmails[student.id],
            editMode: false,
          },
        }));
        dispatch(
          updateStudentAction({
            ...student,
            hrEmail: hrEmails[student.id].hrEmail,
          })
        );
      })
      .finally(() => {
        setHrEmails((oldHrEmails) => ({
          ...oldHrEmails,
          [student.id]: {
            ...oldHrEmails[student.id],
            loading: false,
          },
        }));
      });
  };

  const cancelEditMode = (student) => {
    setHrEmails((oldHrEmails) => ({
      ...oldHrEmails,
      [student.id]: {
        student: student.id,
        hrEmail: student.hrEmail,
        editMode: false,
        loading: false,
      },
    }));
  };

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

  return (
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
      {students?.map((student) => (
        <Row className="border-top py-1 grid-row" key={student.id}>
          <Col>{student.name}</Col>
          {groupName === "all" && (
            <Col>{getGroupNameById(student.group_id)}</Col>
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
  );
};

export default StudentList;
