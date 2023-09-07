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
import {
  FETCH_STATES,
  getAllTestsAction,
} from "../store/reducers/testsReducer";
import { getAllCandidatesOfTestAction } from "../store/reducers/candidatesReducer";
import { studentGroups, students } from "../data/studentGroups";
import { TestCandidateResults } from "../components/TestCandidateResults";
import TestCandidatesTotal from "../components/TestCandidatesTotal";
import { getAllQuestionsOfTestAction } from "../store/actions/questionActions";
import TestQuestions from "../components/TestQuestions";
import { utils, writeFile } from "xlsx";
import { getCleanTestName, getDateStringFromISO } from "../utils/utils";

const fields = {
  name: "full_name",
  email: "email",
  score: "percentage_score",
};

const TestPage = () => {
  const { testId, sortBy, asc } = useParams();

  const { workintechTests, fetchState: testsFetchState } = useSelector(
    (state) => state.tests
  );
  const { candidates, fetchStates } = useSelector((state) => state.candidates);

  const [testCandidates, setTestCandidates] = useState([]);
  const [test, setTest] = useState();
  const [sortByState, setSortByState] = useState("full_name");
  const [ascState, setAscState] = useState("asc");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState("results");
  const questions = useSelector(
    (state) => state.questions.testQuestions[testId]
  );
  const dispatch = useDispatch();

  const inverseOrder = (ord) => (ord === "asc" ? "desc" : "asc");
  const numberOrder = (ord) => (ord === "asc" ? 1 : -1);

  const candidatesToList = useCallback(() => {
    return testCandidates
      ?.filter((candidate) => students[selectedGroup].includes(candidate.email))
      ?.filter(
        (candidate) =>
          candidate.full_name
            .toLocaleLowerCase()
            .includes(filterText.toLocaleLowerCase()) ||
          candidate.email
            .toLocaleLowerCase()
            .includes(filterText.toLocaleLowerCase())
      )
      ?.sort((tc1, tc2) =>
        (
          sortByState === "score"
            ? tc1[fields[sortByState]] > tc2[fields[sortByState]]
            : tc1[fields[sortByState]].toLocaleLowerCase() >
              tc2[fields[sortByState]].toLocaleLowerCase()
        )
          ? numberOrder(ascState) * 1
          : numberOrder(ascState) * -1
      );
  });

  const getGeneralInfo = useCallback(() => {
    const dateOrderList = candidatesToList()?.sort(
      (c1, c2) =>
        new Date(c1.attempt_starttime) - new Date(c2.attempt_starttime)
    );

    return {
      test: test?.name,
      group: studentGroups.find((g) => g.value === selectedGroup).name,
      candidateCount: `${candidatesToList()?.length} / ${
        students[selectedGroup].length
      }`,
      candidateRate:
        (candidatesToList()?.length / students[selectedGroup].length) * 100,
      firstAttemptDate:
        dateOrderList?.length > 0 && dateOrderList[0].attempt_starttime,
      lastAttemptDate:
        dateOrderList?.length > 0 &&
        dateOrderList[dateOrderList.length - 1].attempt_starttime,
      average:
        candidatesToList()?.length &&
        candidatesToList()?.reduce(
          (total, student) => total + student.percentage_score,
          0
        ) / candidatesToList().length,
    };
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

  const toggleTab = (tabId) => {
    setActiveTab(tabId);
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
        Date: stu.attempt_starttime,
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
      return {
        No: i + 1,
        Name: questions[qId]?.name,
        Statement: questions[qId]?.problem_statement,
      };
    });
    const wsQuestions = utils.json_to_sheet(questionsSheetJson);

    // ADD SHEETS TO WORKBOOK
    utils.book_append_sheet(wb, wsGeneral, "General");
    utils.book_append_sheet(wb, wsDetail, "Detail");
    utils.book_append_sheet(wb, wsQuestions, "Questions");

    writeFile(wb, `${test.name}_${selectedGroup}.xlsx`);
  };

  useEffect(() => {
    if (testId) {
      const testInStore = workintechTests.find((t) => t.id === testId);
      if (testInStore) {
        setTest(workintechTests.find((t) => t.id === testId));
        if (
          fetchStates[testId] !== FETCH_STATES.FETHCED &&
          fetchStates[testId] !== FETCH_STATES.FETCHING
        ) {
          dispatch(getAllCandidatesOfTestAction(testId));
          dispatch(getAllQuestionsOfTestAction(testId));
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
    setTestCandidates(candidates[testId]);
  }, [candidates]);

  useEffect(() => {
    setSortByState(sortBy || "name");
    setAscState(asc || "asc");
  }, [sortBy, asc]);

  return (
    <PageDefault pageTitle={getCleanTestName(test?.name)}>
      <div className="pt-3 pb-2">
        <div className="d-flex">
          <Input
            type="text"
            className="me-2"
            placeholder="Type to filter"
            onChange={(e) => setFilterText(e.target.value)}
          ></Input>
          <Input
            type="select"
            className="me-2"
            defaultValue={"all"}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            {studentGroups.map((group) => (
              <option value={group.value} key={group.value}>
                {group.name}
              </option>
            ))}
          </Input>
          <Button className="text-nowrap" onClick={downloadCSV}>
            Download CSV
          </Button>
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
                {students[selectedGroup].length}
              </Col>
            </Row>
            <Row className="border-bottom pb-1 mb-2">
              <Col sm="4">Katılım Oranı (%):</Col>
              <Col sm="8">{getGeneralInfo()?.candidateRate.toFixed(0)} %</Col>
            </Row>
            <Row className="border-bottom pb-1 mb-2">
              <Col sm="4">Tarih Aralığı:</Col>
              <Col sm="8">
                {getDateStringFromISO(getGeneralInfo()?.firstAttemptDate)}
                {" - "}
                {getDateStringFromISO(getGeneralInfo()?.lastAttemptDate)}
              </Col>
            </Row>
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
          />
        </TabPane>
        <TabPane tabId="resultsInDetail">
          <TestCandidateResults test={test} candidates={candidatesToList()} />
        </TabPane>
        <TabPane tabId="questions">
          <TestQuestions
            testId={testId}
            testQuestions={test?.questions || []}
          />
        </TabPane>
      </TabContent>
    </PageDefault>
  );
};

export default TestPage;
