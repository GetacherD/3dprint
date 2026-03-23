
import { Container, Text } from "@mantine/core";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        borderTop: "1px solid #e9ecef",
        background: "#ffffff",
      }}
    >
      <Container size="lg" py="md">
        
        <Text size="sm" c="dimmed" ta="center">
          © {new Date().getFullYear()} Designed and Developed by{" "}
          <strong>Getacher Demisse</strong>
        </Text>
      </Container>
    </footer>
  );
}

