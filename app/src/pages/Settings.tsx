import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Card,
  Form,
  Select,
  Switch,
  Button,
  Divider,
  Row,
  Col,
  Typography,
} from "antd";

const { Option } = Select;
const { Title } = Typography;

const Settings = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;

  const checkAuthority = useCallback(async () => {
    if (!connection || !wallet) {
      navigate("/");
      return;
    }
  }, [connection, wallet, navigate]);

  useEffect(() => {
    checkAuthority();
  }, [checkAuthority]);

  const [stayLoggedIn, setStayLoggedIn] = useState("once");
  const [language, setLanguage] = useState("english");
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSave = () => {
    // Implement save functionality
    console.log({
      stayLoggedIn,
      language,
      darkMode,
      twoFactorAuth,
    });
  };

  return (
    <Card title="Settings">
      <Form layout="vertical">
        <Title level={4}>Preferences</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Stay Logged In">
              <Select value={stayLoggedIn} onChange={setStayLoggedIn}>
                <Option value="once">Once</Option>
                <Option value="15mins">15 minutes</Option>
                <Option value="30mins">30 minutes</Option>
                <Option value="1hr">1 hour</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Language">
              <Select value={language} onChange={setLanguage}>
                <Option value="english">English</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Appearance</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Dark Mode">
              <Row>
                <Col span={24}>
                  <Switch
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Two-Factor Authentication">
              <Row>
                <Col span={24}>
                  <Switch
                    checked={twoFactorAuth}
                    onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Additional Settings</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Customize Notifications">
              <Select defaultValue="push">
                <Option value="email">Email</Option>
                <Option value="sms">SMS</Option>
                <Option value="push">Push Notifications</Option>
                {/* Add more notification options here */}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Privacy Settings">
              <Select defaultValue="public">
                <Option value="public">Public</Option>
                <Option value="private">Private</Option>
                <Option value="custom">Custom</Option>
                {/* Add more privacy options here */}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Backup and Restore">
              <Button type="default">Backup Now</Button>
              <Button className="ml-4" type="default">
                Restore Now
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.Item>
          <Button type="primary" onClick={handleSave}>
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Settings;