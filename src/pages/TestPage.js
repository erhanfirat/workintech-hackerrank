import { useCallback, useEffect, useState } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useRouteMatch } from "react-router-dom";
import { Button, Col, Container, Input, Row } from "reactstrap";
import { FETCH_STATES } from "../store/reducers/testsReducer";
import { getAllCandidatesOfTestAction } from "../store/reducers/candidatesReducer";
import { downloadFile } from "../utils/utils";
import { studentGroups, students } from "../data/studentGroups";
import { TestCandidateResults } from "../components/TestCandidateResults";
import TestCandidatesTotal from "../components/TestCandidatesTotal";

const fields = {
  name: "full_name",
  email: "email",
  score: "percentage_score",
};

const TestPage = () => {
  const { workintechTests } = useSelector((state) => state.tests);
  const { candidates, fetchStates } = useSelector((state) => state.candidates);

  const [testCandidates, setTestCandidates] = useState([]);
  const [test, setTest] = useState();
  const [sortByState, setSortByState] = useState("full_name");
  const [ascState, setAscState] = useState("asc");
  const [average, setAverage] = useState();
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [filterText, setFilterText] = useState("");

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

  useEffect(() => {
    if (testId) {
      setTest(workintechTests.find((t) => t.id === testId));
      if (fetchStates[testId] !== FETCH_STATES.FETHCED) {
        dispatch(getAllCandidatesOfTestAction(testId));
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
      <Container>
        <Row>
          <Col>
            <Input
              type="text"
              placeholder="Type to filter"
              onChange={(e) => setFilterText(e.target.value)}
            ></Input>
          </Col>
          <Col>
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
          </Col>
        </Row>
      </Container>
      <TestCandidatesTotal
        candidates={candidatesToList()}
        inverseOrder={inverseOrder}
        sortIcon={sortIcon}
        sortByState={sortByState}
        ascState={ascState}
        testId={testId}
      />
      <Container className="mt-3">
        <Row>
          <Col>
            <h4>Genel Değerlendirme</h4>
          </Col>
        </Row>
        <Row>
          <Col>Ortalama</Col>
          <Col>{average?.toFixed(2)}</Col>
        </Row>
        <Row>
          <Col></Col>
        </Row>
      </Container>
      <TestCandidateResults test={test} candidates={candidatesToList()} />
    </PageDefault>
  );
};

export default TestPage;
