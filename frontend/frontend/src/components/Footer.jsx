
import { Container, Text, Group, Stack, Anchor } from "@mantine/core";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-card)",
      }}
    >
      <Container size="lg" py="xl">
        <Stack gap={12}>
          <Group justify="space-between" align="center" wrap="wrap">
            <Text fw={700} c="var(--text-primary)">3D Market</Text>
            <Group gap="lg">
              <Anchor size="sm" c="var(--text-primary)" fw={500}>Privacy</Anchor>
              <Anchor size="sm" c="var(--text-primary)" fw={500}>Terms</Anchor>
              <Anchor size="sm" c="var(--text-primary)" fw={500}>Support</Anchor>
            </Group>
          </Group>

          <Text size="sm" c="var(--text-secondary)">
            © {new Date().getFullYear()} Designed and Developed by <strong>Getacher Demisse</strong>
          </Text>
        </Stack>
      </Container>
    </footer>
  );
}

