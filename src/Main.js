import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./components/App";
import Home from "./components/Home";

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Main;
