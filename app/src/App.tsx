import { useState } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { Button, Layout, theme } from "antd";
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
  Authorization,
  MedicalRecords,
  Medications,
  LabResults,
} from "./pages/patient";
import Test from "./pages/test";

const { Header, Sider, Content } = Layout;

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const toggleTheme = () => setDarkTheme(!darkTheme);

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const endpoint = clusterApiUrl("devnet");

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]}>
        <Router>
          <Layout>
            <Sider
              collapsed={collapsed}
              collapsible
              trigger={null}
              theme={darkTheme ? "dark" : "light"}
              className="h-screen"
            >
              <Logo darkTheme={darkTheme} collapsed={collapsed} />
              <MenuList darkTheme={darkTheme} />
              <ToggleThemeButton
                darkTheme={darkTheme}
                toggleTheme={toggleTheme}
              />
            </Sider>

            <Layout>
              <Header
                className="p-0 flex flex-wrap h-auto items-center justify-between pr-10"
                style={{ background: colorBgContainer }}
              >
                <Button
                  type="text"
                  className="ml-4"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                />
                <DateTime />
                <WalletConnect />
              </Header>

              <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                <div style={{ padding: 24, background: colorBgContainer }}>
                  <Routes>
                    <Route path="/" element={<div>Dashboard</div>} />
                    <Route path="/authorization" element={<Authorization />} />
                    <Route
                      path="/medical-record"
                      element={<MedicalRecords />}
                    />
                    <Route path="/medications" element={<Medications />} />
                    <Route path="/labResults" element={<LabResults />} />
                    <Route path="/test" element={<Test />} />
                  </Routes>
                </div>
              </Content>
            </Layout>
          </Layout>
        </Router>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
