export const DEFAULT_EDITOR_CODE = `import { Html, Body, Container, Heading, Text, Button } from "@react-email/components";

type WelcomeEmailProps = {
  recipientName?: string;
};

export default function WelcomeEmail({ recipientName = "there" }: WelcomeEmailProps) {
  return (
    <Html>
      <Body style={{ backgroundColor: "#f7f7f8", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "40px auto", backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px" }}>
          <Heading as="h1" style={{ fontSize: "24px", marginBottom: "12px" }}>
            Welcome, {recipientName}
          </Heading>
          <Text style={{ color: "#4b5563", lineHeight: "24px", marginBottom: "20px" }}>
            Your new email template is ready. You can adjust copy, colors, and layout from this editor.
          </Text>
          <Button href="https://example.com" style={{ backgroundColor: "#111827", color: "#ffffff", padding: "12px 18px", borderRadius: "8px" }}>
            Launch Campaign
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
`;
