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
import { studentGroups, students } from "../data/studentGroups";
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

const fields = {
  name: "full_name",
  email: "email",
  score: "percentage_score",
  "start-date": "startDateStr",
  "end-date": "endDateStr",
};

const TestPage = () => {
  const { testId, sortBy, asc } = useParams();

  const { workintechTests, fetchState: testsFetchState } = useSelector(
    (state) => state.tests
  );
  const test = useSelector((state) =>
    state.tests.workintechTests.find((t) => t.id === testId)
  );
  const candidateFetchState = useSelector(
    (state) => state.candidates?.fetchStates?.[testId]
  );
  const testCandidates = useSelector(
    (state) => state.candidates?.candidates?.[testId]
  );

  const [sortByState, setSortByState] = useState("full_name");
  const [ascState, setAscState] = useState("asc");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState("results");
  const [allPDFLoading, setAllPDFLoading] = useState(false);
  const questions = useSelector(
    (state) => state.questions.testQuestions[testId]
  );
  const dispatch = useDispatch();

  const inverseOrder = (ord) => (ord === "asc" ? "desc" : "asc");
  const numberOrder = (ord) => (ord === "asc" ? 1 : -1);

  const candidatesToList = useCallback(() => {
    return testCandidates
      ?.filter((candidate) =>
        selectedGroup ? students[selectedGroup].includes(candidate.email) : true
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
      ?.sort((tc1, tc2) =>
        (
          sortByState === "score"
            ? tc1[fields[sortByState]] > tc2[fields[sortByState]]
            : tc1[fields[sortByState]]?.toLocaleLowerCase() >
              tc2[fields[sortByState]]?.toLocaleLowerCase()
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
        selectedGroup && students[selectedGroup]?.length
      }`,
      candidateRate:
        ((candidatesToList()?.length || 0) /
          (students[selectedGroup]?.length || 1)) *
        100,
      firstAttemptDate:
        dateOrderList?.length > 0 && dateOrderList[0].startDateStr,
      lastAttemptDate:
        dateOrderList?.length > 0 &&
        dateOrderList[dateOrderList.length - 1].startDateStr,
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
          className={`pe-2 fa-solid fa-chevron-${
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

    writeFile(wb, `${test.name}_${selectedGroup}.xlsx`);
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
              console.log(pdfURLs);
              doSRRequestResponse(
                srEndpoints.downloadAllPDFs(testId, selectedGroup, pdfURLs)
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
    <PageDefault pageTitle={getCleanTestName(test?.name)}>
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
            defaultValue={"all"}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            {studentGroups.map((group) => (
              <option value={group.value} key={group.value}>
                {group.name}
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
            className="text-nowrap"
            onClick={downloadAllPDF}
            loading={allPDFLoading}
          >
            <i className="fa-solid fa-download me-2"></i>
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
              <Col sm="8">{getGeneralInfo()?.candidateCount}</Col>
            </Row>
            {selectedGroup && (
              <Row className="border-bottom pb-1 mb-2">
                <Col sm="4">Katılım Oranı (%):</Col>
                <Col sm="8">
                  {selectedGroup &&
                    `${getGeneralInfo()?.candidateRate.toFixed(0)} %`}
                </Col>
              </Row>
            )}
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
