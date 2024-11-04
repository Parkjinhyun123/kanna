import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./components/App";
import Mystic from "./pages/group/mystic/Mystic";
// import Universe from "./pages/Universe";
// import Cliche from "./pages/Cliche";
// import Stelalive from "./pages/Stelalive";
import Home from "./components/Home";

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="mystic" element={<Mystic />} />
          {/* <Route path="universe" element={<Universe />} />
          <Route path="cliche" element={<Cliche />} />
          <Route path="stelalive" element={<Stelalive />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default Main;
