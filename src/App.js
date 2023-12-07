import React, { useEffect, useRef, useState } from "react";
import "./App.css";

// Mock Server
const FAILURE_COUNT = 10;
const LATENCY = 200;

function getRandomBool(n) {
  const threshold = 1000;
  if (n > threshold) n = threshold;
  return Math.floor(Math.random() * threshold) % n === 0;
}

function getSuggestions(text) {
  var pre = "pre";
  var post = "post";
  var results = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        reject();
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}

function App() {
  const inputRef = useRef();
  const sectionRef = useRef();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [sectionData, setSectionData] = useState([]);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target !== inputRef.current && e.target !== sectionRef.current) {
        setVisible(false);
      }
    });
    return () => {
      window.removeEventListener("click", () => {});
    };
  });

  const handleChange = (e) => {
    const { value } = e.target;
    setQuery(value);
    makeApiCall(value);
  };

  const makeApiCall = async (query) => {
    try {
      let res = await getSuggestions(query);
      setSectionData(res);
    } catch (e) {
      setSectionData([]);
      console.error(e);
    }
  };

  return (
    <div className="App">
      <h1>Auto Suggestion in React </h1>
      <input
        id="search"
        placeholder="type your query"
        name="search"
        type="text"
        value={query}
        ref={inputRef}
        onFocus={() => setVisible(true)}
        onChange={handleChange}
      />
      {visible && (
        <div id="suggestion_area" ref={sectionRef}>
          {sectionData.map((e) => (
            <div onClick={() => setQuery(e)}>{e}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
