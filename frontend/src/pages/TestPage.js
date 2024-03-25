import { useCallback, useEffect, useState } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Badge,
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
import { getAllTestsAction } from "../store/reducers/testsReducer";
import {
  fetchAllCandidatesOfTestAction,
  getAllCandidatesOfTestAction,
} from "../store/reducers/candidatesReducer";
import { TestCandidateResults } from "../components/TestCandidateResults";
import TestCandidatesTotal from "../components/TestCandidatesTotal";
import { fetchAllQuestionsOfTestAction } from "../store/actions/questionActions";
import TestQuestions from "../components/TestQuestions";
import { utils, writeFile } from "xlsx";
import { getCleanTestName, getDateStringFromISO } from "../utils/utils";
import { FETCH_STATES } from "../utils/constants";
import { doHRRequest, doSRRequestResponse } from "../api/api";
import { hrEndpoints } from "../api/hrEndpoints";
import { srEndpoints } from "../api/srEndpoints";
import SpinnerButton from "../components/atoms/SpinnerButton";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import NonAttendees from "../components/NonAttendees";

const fields = {
  name: "full_name",
  email: "email",
  score: "percentage_score",
  "start-date": "startDateStr",
  "end-date": "endDateStr",
};

const TestPage = () => {
  const { testId, groupCode, sortBy, asc } = useParams();
  const group = useSelector((s) =>
    s.students.groups.find((g) => g.name.trim().toLowerCase() === groupCode)
  );
  const groupTestInfo = useSelector((s) =>
    s.students.groupTestsInfo?.find(
      (gti) => gti.test_id === testId && gti.group_id === group.id
    )
  );

  const { workintechTests, fetchState: testsFetchState } = useSelector(
    (state) => state.tests
  );
  const { groups, students } = useSelector((s) => s.students);
  const test = useSelector((state) =>
    state.tests.workintechTests.find((t) => t.id === testId)
  );
  const candidateFetchState = useSelector(
    (state) => state.candidates?.fetchStates?.[testId]
  );
  const testCandidates = useSelector(
    (state) => state.candidates?.candidates?.[testId]
  );

  const history = useHistory();

  const [sortByState, setSortByState] = useState("full_name");
  const [ascState, setAscState] = useState("asc");
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState("results");
  const [allPDFLoading, setAllPDFLoading] = useState(false);
  const [emailPDFLoading, setEmailPDFLoading] = useState(false);
  const questions = useSelector(
    (state) => state.questions.testQuestions[testId]
  );
  const dispatch = useDispatch();

  const inverseOrder = (ord) => (ord === "asc" ? "desc" : "asc");
  const numberOrder = (ord) => (ord === "asc" ? 1 : -1);

  const candidatesToList = useCallback(() => {
    return testCandidates
      ?.filter(
        (candidate) =>
          groupCode === "all" ||
          students[getIdOfSelectedGroup(groupCode)]?.find(
            (ss) =>
              ss.email.toLocaleLowerCase("en") ===
                candidate.email.toLocaleLowerCase("en") ||
              ss.hrEmail?.toLocaleLowerCase("en") ===
                candidate.email.toLocaleLowerCase("en")
          )
      )
      ?.filter((candidate) => {
        const filterList = filterText.split(",");
        for (let i = 0; i < filterList.length; i++) {
          const seachText = filterList[i].toLocaleLowerCase();
          if (
            candidate.full_name?.toLocaleLowerCase().includes(seachText) ||
            candidate.email?.toLocaleLowerCase().includes(seachText)
          )
            return true;
        }
        return false;
      })
      ?.sort((tc1, tc2) => {
        if (sortByState === "score") {
          return tc1[fields[sortByState]] > tc2[fields[sortByState]]
            ? numberOrder(ascState) * 1
            : numberOrder(ascState) * -1;
        } else if (sortByState === "group") {
          const st1 = getStudentByEmail(tc1.email);
          const st2 = getStudentByEmail(tc2.email);
          if (!st1 || !st2) return -1;
          return st1.group_id > st2.group_id
            ? numberOrder(ascState) * 1
            : numberOrder(ascState) * -1;
        } else {
          return tc1[fields[sortByState]]?.toLocaleLowerCase() >
            tc2[fields[sortByState]]?.toLocaleLowerCase()
            ? numberOrder(ascState) * 1
            : numberOrder(ascState) * -1;
        }
      });
  });

  const getGeneralInfo = useCallback(() => {
    const dateOrderList = candidatesToList()?.sort(
      (c1, c2) =>
        new Date(c1.attempt_starttime) - new Date(c2.attempt_starttime)
    );

    return {
      test: test?.name,
      group: group?.title,
      candidateCount: groupTestInfo?.attendee_count,
      totalCount: groupTestInfo?.total_count,
      candidateRate: (
        (groupTestInfo?.attendee_count / groupTestInfo?.total_count) *
        100
      ).toFixed(1),
      firstAttemptDate:
        dateOrderList?.length > 0 && dateOrderList[0].startDateStr,
      lastAttemptDate:
        dateOrderList?.length > 0 &&
        dateOrderList[dateOrderList.length - 1].startDateStr,
      average: groupTestInfo?.average_score,
    };
  });

  const sortIcon = useCallback((fieldName, sortByVal, ascVal) => {
    return (
      sortByVal === fieldName && (
        <i
          className={`pe-2 fa-solid fa-chevron-${
            ascVal === "asc" ? "down" : "up"
          }`}
        ></i>
      )
    );
  });

  const getIdOfSelectedGroup = useCallback(
    (selectedGroupName) =>
      groups.find(
        (g) => g.name.toLowerCase() === selectedGroupName.toLowerCase()
      )?.id
  );

  const toggleTab = (tabId) => {
    setActiveTab(tabId);
  };

  const getStudentByEmail = useCallback((candidateEmail) =>
    students.all.find(
      (s) =>
        s.email.toLocaleLowerCase("en") ===
          candidateEmail.toLocaleLowerCase("en") ||
        s.hrEmail?.toLocaleLowerCase("en") ===
          candidateEmail.toLocaleLowerCase("en")
    )
  );

  const getGroupNameByEmail = useCallback((candidateEmail) => {
    const student = getStudentByEmail(candidateEmail);
    return groups.find((g) => g.id == student?.group_id)?.title;
  });

  const changeSelectedGroup = (e) => {
    history.push(
      `/tests/${testId}/${e.target.value.trim().toLowerCase()}${
        sortBy ? "/" + sortBy + "/" + asc : ""
      }`
    );
  };

  const downloadCSV = () => {
    // CREATE WORKBOOK
    const wb = utils.book_new();

    // CREATE GENERAL SHEET
    const wsGeneral = utils.json_to_sheet([getGeneralInfo()]);

    // CREATE DETAIL SHEET
    const detailSheetJson = candidatesToList().map((stu) => {
      const stuResult = {
        Name: stu.full_name,
        Email: stu.email,
        Date: stu.startDateStr,
        "Score (%)": stu.percentage_score,
      };

      test.questions.forEach((question, i) => {
        stuResult[`q${i + 1}`] = stu.questions[question];
      });

      return stuResult;
    });
    const wsDetail = utils.json_to_sheet(detailSheetJson);

    // CREATE DETAIL SHEET
    const questionsSheetJson = test.questions.map((qId, i) => {
      const question = questions[qId];
      const res = {
        No: i + 1,
        Name: questions[qId]?.name,
        Statement: questions[qId]?.problem_statement,
      };
      question?.options?.forEach((option, i) => {
        res[`option_${i + 1}`] = option;
      });
      res.tags = question?.tags?.toString();
      res.answer = question?.answer;
      return res;
    });
    const wsQuestions = utils.json_to_sheet(questionsSheetJson);

    // ADD SHEETS TO WORKBOOK
    utils.book_append_sheet(wb, wsGeneral, "General");
    utils.book_append_sheet(wb, wsDetail, "Detail");
    utils.book_append_sheet(wb, wsQuestions, "Questions");

    writeFile(wb, `${test.name}_${groupCode}.xlsx`);
  };

  const downloadAllPDF = () => {
    const pdfURLs = [];
    try {
      setAllPDFLoading(true);
      candidatesToList().forEach((candidate) => {
        doHRRequest(hrEndpoints.getPDFReport(testId, candidate.id)).then(
          (pdfURL) => {
            pdfURLs.push({ candidate: candidate.email, url: pdfURL });
            if (pdfURLs.length === candidatesToList().length) {
              doSRRequestResponse(
                srEndpoints.downloadAllPDFs(testId, groupCode, pdfURLs)
              )
                .then((res) => {
                  const contentDisposition = res.headers["content-disposition"];
                  const match = contentDisposition.match(/filename="(.+)"/);
                  const fileName = match[1];

                  const blob = new Blob([res.data], {
                    type: "application/zip",
                  });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = fileName;

                  document.body.appendChild(link);
                  link.click();

                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(link);
                })
                .catch((err) => {
                  console.log("download err: ", err);
                })
                .finally(() => setAllPDFLoading(false));
            }
          }
        );
      });
    } catch (e) {
      setAllPDFLoading(false);
    }
  };

  const emailAllPDF = () => {
    const pdfURLs = [];
    try {
      setEmailPDFLoading(true);
      candidatesToList().forEach((candidate) => {
        doHRRequest(hrEndpoints.getPDFReport(testId, candidate.id)).then(
          (pdfURL) => {
            pdfURLs.push({
              url: pdfURL,
              studentId: candidate.student_id,
              testId,
            });
            if (pdfURLs.length === candidatesToList().length) {
              doSRRequestResponse(srEndpoints.candidateSendReport(pdfURLs))
                .then((res) => {})
                .catch((err) => {
                  console.log("Err sendin email: ", err);
                })
                .finally(() => setEmailPDFLoading(false));
            }
          }
        );
      });
    } catch (e) {
      setEmailPDFLoading(false);
    }
  };

  const refetchTestCandidates = () => {
    dispatch(fetchAllCandidatesOfTestAction(testId));
  };

  useEffect(() => {
    if (testId) {
      if (test) {
        if (
          !candidateFetchState?.[testId] ||
          (candidateFetchState[testId] !== FETCH_STATES.FETHCED &&
            candidateFetchState[testId] !== FETCH_STATES.FETCHING)
        ) {
          dispatch(getAllCandidatesOfTestAction(testId));
          // TODO: Fetch questions logic should be depended on its own fetch state
          dispatch(fetchAllQuestionsOfTestAction(testId));
        }
      } else {
        // fetch all tests here for opening test page for the first
        if (testsFetchState === FETCH_STATES.NOT_STARTED) {
          dispatch(getAllTestsAction());
        }
      }
    }
  }, [workintechTests, testId]);

  useEffect(() => {
    setSortByState(sortBy || "name");
    setAscState(asc || "asc");
  }, [sortBy, asc]);

  return (
    <PageDefault
      pageTitle={`${getCleanTestName(test?.name)} | ${group?.title}`}
    >
      <div className="d-flex justify-content-end align-items-baseline pb-3">
        <Badge color="warning" className="me-2">
          All: {testCandidates?.length || 0}
        </Badge>
        <Badge color="warning" className="me-2">
          Current: {candidatesToList()?.length || 0}
        </Badge>
        <SpinnerButton
          size="sm"
          iconClass="fa-solid fa-rotate me-2"
          loading={candidateFetchState === FETCH_STATES.FETCHING}
          color="primary"
          title="Eğer Hackkerrank testlerinde güncelleme olmadıysa bu işlemi başlatmayın!"
          onClick={refetchTestCandidates}
        >
          Sync Candidates with HR
        </SpinnerButton>
      </div>

      <div className="pb-2">
        <div className="d-flex">
          <Input
            type="text"
            className="me-2"
            placeholder="Multi filter query by comma: [ali, batu, hilal]"
            onChange={(e) => setFilterText(e.target.value)}
          ></Input>
          <Input
            type="select"
            className="me-2"
            defaultValue={groupCode}
            onChange={changeSelectedGroup}
          >
            {groups.map((group) => (
              <option value={group.name.trim().toLowerCase()} key={group.name}>
                {group.title}
              </option>
            ))}
          </Input>
          <Button
            color="primary"
            className="text-nowrap me-2"
            onClick={downloadCSV}
          >
            <i className="fa-solid fa-download me-2"></i>
            Excel Rapor
          </Button>
          <SpinnerButton
            color="primary"
            className="text-nowrap me-2"
            onClick={downloadAllPDF}
            loading={allPDFLoading}
          >
            <i className="fa-solid fa-download me-2"></i>
            All PDFs
          </SpinnerButton>
          <SpinnerButton
            color="primary"
            className="text-nowrap"
            onClick={emailAllPDF}
            loading={emailPDFLoading}
          >
            <i className="fa-solid fa-envelope me-2"></i>
            All PDFs
          </SpinnerButton>
        </div>
      </div>

      <Nav tabs className="mt-2">
        <NavItem>
          <NavLink
            className={`${activeTab === "reports" ? "active" : ""}`}
            onClick={() => toggleTab("reports")}
          >
            Genel Değerlendirme
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={`${activeTab === "results" ? "active" : ""}`}
            onClick={() => toggleTab("results")}
          >
            Sonuçlar
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={`${activeTab === "resultsInDetail" ? "active" : ""}`}
            onClick={() => toggleTab("resultsInDetail")}
          >
            Detaylı Sonuç
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={`${activeTab === "questions" ? "active" : ""}`}
            onClick={() => toggleTab("questions")}
          >
            Sorular
          </NavLink>
        </NavItem>
        {groupCode !== "all" && (
          <NavItem>
            <NavLink
              className={`${activeTab === "nonAttendees" ? "active" : ""}`}
              onClick={() => toggleTab("nonAttendees")}
            >
              Sınava Katılmayanlar
            </NavLink>
          </NavItem>
        )}
      </Nav>

      <TabContent
        activeTab={activeTab}
        className="px-2 py-3 border-start border-bottom border-end"
      >
        <TabPane tabId="reports">
          <Container fluid>
            <Row className="border-bottom pb-1 mb-2">
              <Col sm="4">Test:</Col>
              <Col sm="8">{getGeneralInfo()?.test}</Col>
            </Row>
            <Row className="border-bottom pb-1 mb-2">
              <Col sm="4">Grup:</Col>
              <Col sm="8">{getGeneralInfo()?.group}</Col>
            </Row>
            <Row className="border-bottom pb-1 mb-2">
              <Col sm="4">Katılımcı Sayısı:</Col>
              <Col sm="8">
                {getGeneralInfo()?.candidateCount} /{" "}
                {getGeneralInfo()?.totalCount}
              </Col>
            </Row>
            {groupCode && (
              <Row className="border-bottom pb-1 mb-2">
                <Col sm="4">Katılım Oranı (%):</Col>
                <Col sm="8">
                  {groupCode && `${getGeneralInfo().candidateRate} %`}
                </Col>
              </Row>
            )}
            <Row className="pb-1 mb-2">
              <Col sm="4">Ortalama (%):</Col>
              <Col sm="8">{getGeneralInfo()?.average?.toFixed(2)}</Col>
            </Row>
          </Container>
        </TabPane>
        <TabPane tabId="results">
          <TestCandidatesTotal
            candidates={candidatesToList()}
            inverseOrder={inverseOrder}
            sortIcon={sortIcon}
            sortByState={sortByState}
            ascState={ascState}
            testId={testId}
            groupCode={groupCode}
            getGroupNameByEmail={getGroupNameByEmail}
          />
        </TabPane>
        <TabPane tabId="resultsInDetail">
          <TestCandidateResults
            test={test}
            candidates={candidatesToList()}
            groupCode={groupCode}
            getGroupNameByEmail={getGroupNameByEmail}
          />
        </TabPane>
        <TabPane tabId="questions">
          <TestQuestions
            testId={testId}
            testQuestions={test?.questions || []}
          />
        </TabPane>
        {groupCode !== "all" && (
          <TabPane tabId="nonAttendees">
            <NonAttendees groupCode={groupCode} testId={testId} />
          </TabPane>
        )}
      </TabContent>
    </PageDefault>
  );
};

export default TestPage;
