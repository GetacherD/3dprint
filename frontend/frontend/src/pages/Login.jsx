import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Text,
  Anchor,
  Stack,
  Box,
} from "@mantine/core";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      login(res.data.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    }
  };

  return (
    <Box style={{ background: "var(--bg-primary)", minHeight: "100vh", padding: "24px 12px" }}>
      <Container size={420} my={40}>
        <Paper
          withBorder
          shadow="md"
          p="xl"
          radius="var(--radius-lg)"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow-md)" }}
        >
          <Stack gap="md">
            <Box ta="center" mb={4}>
              <Title order={2} c="var(--text-primary)">Welcome Back</Title>
              <Text size="sm" c="var(--text-secondary)" mt={6}>Sign in to continue shopping</Text>
            </Box>

            <TextInput
              label="Email"
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
              styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
            />

            <PasswordInput
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
            />

            <Button
              fullWidth
              mt="sm"
              size="md"
              radius="xl"
              onClick={handleLogin}
              style={{ background: "var(--primary)", color: "#fff", boxShadow: "var(--shadow-sm)", fontWeight: 700 }}
            >
              Sign in
            </Button>

            <Text size="sm" ta="center" mt="xs" c="var(--text-secondary)">
              Don’t have an account?{" "}
              <Anchor component="button" onClick={() => navigate("/register")} c="var(--primary)" fw={600}>
                Create one
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}