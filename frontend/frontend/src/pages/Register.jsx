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
              <Title order={2} c="var(--text-primary)">Create account</Title>
              <Text size="sm" c="var(--text-secondary)" mt={6}>Join 3D Market in seconds</Text>
            </Box>

            <TextInput
              label="Name"
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
              styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
            />

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
              onClick={handleRegister}
              style={{ background: "var(--primary)", color: "#fff", boxShadow: "var(--shadow-sm)", fontWeight: 700 }}
            >
              Sign up
            </Button>

            <Text size="sm" ta="center" mt="xs" c="var(--text-secondary)">
              Already have an account?{" "}
              <Anchor
                component="button"
                onClick={() => navigate("/login")}
                fw={600}
                c="var(--primary)"
              >
                Sign in
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}