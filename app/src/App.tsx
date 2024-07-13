import { useState } from "react";
import { Buffer } from "buffer";
import { Button, Layout, theme } from "antd";
import { clusterApiUrl } from "@solana/web3.js";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  Logo,
  MenuList,
  ToggleThemeButton,
  DateTime,
  WalletConnect,
} from "./components";
import {
  HomePage,
  Authorization,
  MedicalRecords,
  Medications,
  LabResults,
  DoctorAuthorization,
  DoctorMedicalRecord,
  Profile,
} from "./pages";
import Test from "./pages/test";

const { Header, Sider, Content } = Layout;
window.Buffer = Buffer;

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const endpoint = clusterApiUrl("devnet");

  return (
    <ThirdwebProvider clientId={process.env.REACT_APP_ThirdWeb_Client_ID}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]}>
          <Router>
            <Layout>
              <Sider
                collapsed={collapsed}
                collapsible
                trigger={null}
                theme={darkTheme ? "dark" : "light"}
                style={{
                  overflow: "auto",
                  height: "100vh",
                  position: "fixed",
                  left: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <Logo darkTheme={darkTheme} collapsed={collapsed} />
                <MenuList darkTheme={darkTheme} />
                <ToggleThemeButton
                  darkTheme={darkTheme}
                  toggleTheme={() => setDarkTheme(!darkTheme)}
                />
              </Sider>

              <Layout
                className={`${collapsed ? "ml-[80px]" : "ml-[200px]"} transition-all duration-200`}
              >
                <Header
                  className="p-0 flex flex-wrap h-auto items-center justify-between pr-10 gap-4"
                  style={{ background: colorBgContainer }}
                >
                  <Button
                    type="text"
                    className="ml-4 flex-none"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                  />
                  <DateTime />
                  <WalletConnect />
                </Header>

                <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                  <div
                    className="min-h-[calc(100vh-138px)] overflow-auto"
                    style={{ padding: 24, background: colorBgContainer }}
                  >
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route
                        path="/authorization"
                        element={<Authorization />}
                      />
                      <Route
                        path="/medicalRecord"
                        element={<MedicalRecords />}
                      />
                      <Route path="/medications" element={<Medications />} />
                      <Route path="/labResults" element={<LabResults />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/test" element={<Test />} />
                      <Route
                        path="/doctor/authorization"
                        element={<DoctorAuthorization />}
                      />
                      <Route
                        path="/doctor/medicalRecord"
                        element={<DoctorMedicalRecord />}
                      />
                    </Routes>
                  </div>
                </Content>
              </Layout>
            </Layout>
          </Router>
        </WalletProvider>
      </ConnectionProvider>
    </ThirdwebProvider>
  );
}

export default App;
