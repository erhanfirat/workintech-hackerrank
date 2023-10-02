import { useSelector } from "react-redux";
import StudentList from "./StudentList";
import { Badge } from "reactstrap";
import SpinnerButton from "./atoms/SpinnerButton";
import { doSRRequest } from "../api/api";
import { srEndpoints } from "../api/srEndpoints";

const NonAttendees = ({ groupCode, testId }) => {
  const group = useSelector((s) =>
    s.students.groups?.find(
      (g) => g.name.trim().toLowerCase() === groupCode.trim().toLowerCase()
    )
  );
  const students = useSelector((s) => s.students.students[group?.id]);
  const candidates = useSelector((s) => s.candidates.candidates[testId]);

  const studentsNonAttendees = () => {
    console.log("students: ", students);
    console.log("candidates: ", candidates);
    const finalStudents =
      students
        ?.filter((s) => !candidates?.find((c) => c.student_id === s.id))
        .sort((s1, s2) => (s1.name > s2.name ? 1 : -1)) || [];

    console.log("finalStudents: ", finalStudents);

    return finalStudents;
  };

  const sendReminderMail = () => {
    doSRRequest(srEndpoints.reminderMailToGroup({ testId, groupId: group.id }));
  };

  return (
    <>
      <div className="d-flex justify-content-end align-items-center py-2">
        <Badge className="me-2">
          Katılmayan Toplam: {studentsNonAttendees()?.length}{" "}
        </Badge>
        <SpinnerButton onClick={sendReminderMail}>
          Sınav Hatırlatma Maili Gönder
        </SpinnerButton>
      </div>
      <StudentList students={studentsNonAttendees()} />
    </>
  );
};

export default NonAttendees;
