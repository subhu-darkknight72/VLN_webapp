import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HospitalIndex from "./pages/Hospital/Index";
import HospitalPerformAction from "./pages/Hospital/PerformAction";
import HospitalReset from "./pages/Hospital/ResetAction";

import { Helmet } from 'react-helmet';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospital" element={<HospitalIndex />} />
        <Route path="/hospital/perform-action" element={<HospitalPerformAction />} />
        <Route path="/hospital/reset" element={<HospitalReset />} />
      </Routes>
    </div>
  );
}

export default App;