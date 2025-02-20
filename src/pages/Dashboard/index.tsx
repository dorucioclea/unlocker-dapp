import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageState from "../../components/PageState";
import { contractAddress } from "../../config";
import { useContext, useDispatch } from "../../context";
import Actions from "./Actions";
import { getNftBalance, getTransaction, getTransactions } from "./helpers/asyncRequests";
import Transactions from "./Transactions";

const Dashboard = () => {
  const ref = React.useRef(null);
  const { apiAddress, address } = Dapp.useContext();
  const { transactionsFetched } = useContext();
  const dispatch = useDispatch();

  const fetchData = () => {
    getTransactions({
      apiAddress,
      address,
      timeout: 3000,
      contractAddress,
    }).then(({ data, success }) => {
      dispatch({
        type: "setTransactions",
        transactions: data,
        transactionsFetched: undefined,
      });
      for (const t of data) {
        getTransaction({
          apiAddress,
          address,
          contractAddress,
          timeout: 3000,
          txHash: t.txHash,
        }).then(({ data, success }) => {
          dispatch({
            type: "setTransactionOperations",
            operations: data.operations,
            txHash: data.txHash,
            transactionsFetched: success,
          });
        });
      }
    });
    getNftBalance({
      apiAddress,
      address,
      timeout: 3000
    }).then(({ data, success }) => {
      dispatch({
        type: "setNftBalance",
        nftBalance: data
      });
    });





  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchData, []);

  if (transactionsFetched === undefined) {
    return <PageState svgComponent={<></>} spin />;
  }

  if (transactionsFetched === false) {
    return (
      <PageState
        svgComponent={
          <FontAwesomeIcon icon={faBan} className="text-secondary fa-3x" />
        }
        title="Unavailable"
        className="dapp-icon icon-medium"
      />
    );
  }

  return (
    <div className="container py-4" ref={ref}>
      <div className="row">
        <div className="col-12 col-md-10 mx-auto">
          <div className="card shadow-sm rounded border-0">
            <div className="card-body p-1">
              <div className="card rounded border-0">
                <div className="card-body text-center p-4">
                  <Actions />
                </div>
              </div>
              <Transactions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
