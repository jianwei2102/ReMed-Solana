import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import { Logo, MenuList } from "./components";
import {
  Authorization,
  MedicalRecords,
  Medications,
  LabResults,
} from "./pages/patient";
import Test from "./pages/test";

const { Header, Sider } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Sider className="h-screen min-w-60">
          <Logo />
          <MenuList />
        </Sider>

        <Routes>
          <Route path="/" element={<div> dashboard</div>} />
          <Route path="/authorization" element={<Authorization />} />
          <Route path="/medical-record" element={<MedicalRecords />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/labResults" element={<LabResults />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
