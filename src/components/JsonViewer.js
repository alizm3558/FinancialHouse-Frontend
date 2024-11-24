import React, { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/mode/javascript/javascript";
import "./JsonViewer.css";

const JsonViewer = () => {
  const [fromDate, setFromDate] = useState(""); // Kullanıcıdan alınacak fromDate
  const [toDate, setToDate] = useState(""); // Kullanıcıdan alınacak toDate
  const [transactionId, setTransactionId] = useState(""); // Transaction ID
  const [jsonValue, setJsonValue] = useState(""); // Gelen JSON verisi
  const [loading, setLoading] = useState(false); // Yüklenme durumu

  // Tarihi "yyyy-MM-dd" formatına dönüştüren yardımcı fonksiyon
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // useEffect ile başlangıçta tarihleri bugünün tarihi olarak ayarla
  useEffect(() => {
    const today = getTodayDate();
    setFromDate(today);
    setToDate(today);
  }, []); // Komponent yüklendiğinde çalışır

  const fetchReport = () => {
    sendRequest("http://147.79.118.218:8080/api/transactions/report");
  };

  const fetchTransactionList = () => {
    sendRequest("http://147.79.118.218:8080/api/transactions/list");
  };

  const fetchClient = () => {
    if (!transactionId) {
      setJsonValue("Hata: Transaction ID boş olamaz!");
      return;
    }

    sendPostRequest("http://147.79.118.218:8080/api/client", { transactionId });
  };

  const fetchTransactions = () => {
    if (!transactionId) {
      setJsonValue("Hata: Transaction ID boş olamaz!");
      return;
    }

    sendPostRequest("http://147.79.118.218:8080/api/transaction", { transactionId });
  };

  const sendRequest = (url) => {
    setLoading(true);
    const requestBody = {
      fromDate: fromDate,
      toDate: toDate,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ağ hatası: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setJsonValue(JSON.stringify(data, null, 4));
        setLoading(false);
      })
      .catch((error) => {
        setJsonValue(`Hata: ${error.message}`);
        setLoading(false);
      });
  };

  const sendPostRequest = (url, body) => {
    setLoading(true);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ağ hatası: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setJsonValue(JSON.stringify(data, null, 4));
        setLoading(false);
      })
      .catch((error) => {
        setJsonValue(`Hata: ${error.message}`);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Başlık */}
      <h1 style={{ textAlign: "center" }}>Financial House</h1>

      {/* Tarih seçimi ve Transaction ID bölümü */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {/* Tarih seçimi bölümü */}
        <div style={{ flex: "1", marginLeft: "50px", marginRight: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label>
              From Date:
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              To Date:
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
          <div>
            <button onClick={fetchReport} style={{ marginRight: "10px" }}>
              Get Transaction Report
            </button>
            <button onClick={fetchTransactionList}>Get Transaction List</button>
          </div>
        </div>

        {/* Transaction ID ve Get Client bölümü */}
        <div style={{ flex: "1", marginLeft: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Transaction ID:
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
          <div>
            <button onClick={fetchClient} style={{ marginRight: "10px" }}>
              Get Client
            </button>
            <button onClick={fetchTransactions}>Get Transactions</button>
          </div>
        </div>
      </div>

      {/* JSON Görüntüleyici */}
      {loading && <p>Yükleniyor...</p>}
      <CodeMirror
        value={jsonValue}
        options={{
          mode: "application/json",
          theme: "monokai",
          lineNumbers: true,
          readOnly: true,
        }}
        onBeforeChange={(editor, data, value) => {
          setJsonValue(value);
        }}
        style={{ width: "100%", height: "600px", marginTop: "20px" }}
      />
    </div>
  );
};

export default JsonViewer;
