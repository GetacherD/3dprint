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
    <Container size={420} my={60}>
      <Title ta="center">Welcome Back</Title>

      <Paper withBorder shadow="md" p="lg" mt="md" radius="md">
        <Stack>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth mt="md" size="md" onClick={handleLogin}>
            Sign in
          </Button>

          {/* 🔥 REGISTER LINK */}
          <Text size="sm" ta="center" mt="sm">
            Don’t have an account?{" "}
            <Anchor
              component="button"
              onClick={() => navigate("/register")}
            >
              Create one
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}