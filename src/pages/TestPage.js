import { useCallback, useEffect, useState } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
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
import { downloadFile } from "../utils/utils";
import { studentGroups, students } from "../data/studentGroups";
import { TestCandidateResults } from "../components/TestCandidateResults";
import TestCandidatesTotal from "../components/TestCandidatesTotal";
import { getAllQuestionsOfTestAction } from "../store/actions/questionActions";

const fields = {
  name: "full_name",
  email: "email",
  score: "percentage_score",
};

const TestPage = () => {
  const { workintechTests, fetchState: testsFetchState } = useSelector(
    (state) => state.tests
  );
  const { candidates, fetchStates } = useSelector((state) => state.candidates);

  const [testCandidates, setTestCandidates] = useState([]);
  const [test, setTest] = useState();
  const [sortByState, setSortByState] = useState("full_name");
  const [ascState, setAscState] = useState("asc");
  const [average, setAverage] = useState();
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState("results");

  const dispatch = useDispatch();

  const { testId, sortBy, asc } = useParams();

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

  const calculateAverages = useCallback(() => {
    setAverage(
      () =>
        candidatesToList()?.length &&
        candidatesToList()?.reduce(
          (total, student) => total + student.percentage_score,
          0
        ) / candidatesToList().length
    );
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

  useEffect(() => {
    if (testId) {
      const testInStore = workintechTests.find((t) => t.id === testId);
      if (testInStore) {
        setTest(workintechTests.find((t) => t.id === testId));
        if (fetchStates[testId] !== FETCH_STATES.FETHCED) {
          dispatch(getAllCandidatesOfTestAction(testId));
        }
        dispatch(getAllQuestionsOfTestAction(testId));
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
    calculateAverages();
  }, [candidatesToList()]);

  useEffect(() => {
    setSortByState(sortBy || "name");
    setAscState(asc || "asc");
  }, [sortBy, asc]);

  return (
    <PageDefault pageTitle={test?.name}>
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
            defaultValue={"all"}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            {studentGroups.map((group) => (
              <option value={group.value} key={group.value}>
                {group.name}
              </option>
            ))}
          </Input>
        </div>
      </div>

      <Nav tabs className="mt-2">
        <NavItem>
          <NavLink
            className={`${activeTab === "results" ? "active" : ""}`}
            onClick={() => toggleTab("results")}
          >
            Test Result
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={`${activeTab === "resultsInDetail" ? "active" : ""}`}
            onClick={() => toggleTab("resultsInDetail")}
          >
            Candidates In Detail
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={`${activeTab === "questions" ? "active" : ""}`}
            onClick={() => toggleTab("questions")}
          >
            Questions
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={`${activeTab === "reports" ? "active" : ""}`}
            onClick={() => toggleTab("reports")}
          >
            General
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent
        activeTab={activeTab}
        className="px-2 py-3 border-start border-bottom border-end"
      >
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
        <TabPane tabId="questions"></TabPane>
        <TabPane tabId="reports">
          <Container fluid>
            <Row>
              <Col>Ortalama</Col>
              <Col>{average?.toFixed(2)}</Col>
            </Row>
          </Container>
        </TabPane>
      </TabContent>
    </PageDefault>
  );
};

export default TestPage;
