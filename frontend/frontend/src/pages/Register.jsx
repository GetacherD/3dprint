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
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/api/users", {
        name,
        email,
        password,
      });

      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <Container size={420} my={60}>
      <Title ta="center">Create account</Title>

      <Paper withBorder shadow="md" p="lg" mt="md" radius="md">
        <Stack>
          <TextInput
            label="Name"
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
          />

          <TextInput
            label="Email"
            placeholder="your@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth mt="md" size="md" onClick={handleRegister}>
            Sign up
          </Button>

          {/* 🔥 LOGIN LINK */}
          <Text size="sm" ta="center" mt="sm">
            Already have an account?{" "}
            <Anchor
              component="button"
              onClick={() => navigate("/login")}
              fw={500}
              c="blue"
            >
              Sign in
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}