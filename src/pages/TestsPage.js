import { useEffect, useState } from "react";
import { useAxios } from "../api/useAxios";
import PageDefault from "./PageDefault";
import { endpoints } from "../api/endpoints";

const TestsPage = () => {
  const [tests, getTests, testsLoading, testsErr] = useAxios(endpoints.tests());
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getTests({ instantConfig: { params: { limit: 100, offset: page } } }).then(
      (resData) => {
        setTotal(resData.total);
      }
    );
  }, []);

  return (
    <PageDefault pageTitle="Testler">
      <h3>Toplam test sayısı: {total}</h3>
      {tests?.data?.length}
    </PageDefault>
  );
};

export default TestsPage;
