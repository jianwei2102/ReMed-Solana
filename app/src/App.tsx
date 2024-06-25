import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import { Logo, MenuList, ToggleThemeButton } from "./components";
import {
  Authorization,
  MedicalRecords,
  Medications,
  LabResults,
} from "./pages/patient";
import Test from "./pages/test";

const { Header, Sider } = Layout;

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const toggleTheme = () => setDarkTheme(!darkTheme);

  return (
    <Router>
      <Layout>
        <Sider
          theme={darkTheme ? "dark" : "light"}
          className="h-screen min-w-60"
        >
          <Logo darkTheme={darkTheme} />
          <MenuList darkTheme={darkTheme} />
          <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
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
