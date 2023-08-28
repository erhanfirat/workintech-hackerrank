import { useEffect } from "react";
import PageDefault from "./PageDefault";
import { useDispatch, useSelector } from "react-redux";
import { getAllTestsAction } from "../store/reducers/testsReducer";

const TestsPage = () => {
  const dispatch = useDispatch();
  const { total, allTests, workintechTests } = useSelector(
    (state) => state.tests
  );
  useEffect(() => {
    dispatch(getAllTestsAction());
  }, []);

  return (
    <PageDefault pageTitle="Testler">
      <h3>Toplam test sayısı: {total}</h3>
      <h3>All tests: {allTests.length}</h3>
      <h3>Workintech tests: {workintechTests.length}</h3>
    </PageDefault>
  );
};

export default TestsPage;
