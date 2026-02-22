export const DEFAULT_EDITOR_CODE = `import { Html, Head, Preview, Tailwind, Body, Container, Heading, Text, Button, Hr, Link } from "@react-email/components";

type WelcomeEmailProps = {
  recipientName?: string;
};

export default function WelcomeEmail({ recipientName = "there" }: WelcomeEmailProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Your new email template is ready to customize.</Preview>
        <Body className="mx-auto bg-slate-100 font-sans">
          <Container className="mx-auto my-8 max-w-[560px] rounded-xl bg-white p-8">
            <Heading as="h1" className="mb-3 text-2xl">
              Welcome, {recipientName}
            </Heading>
            <Text className="mb-5 text-base leading-6 text-slate-600">
              Your new email template is ready. You can adjust copy, colors, and layout from this editor.
            </Text>
            <Button href="https://example.com" className="rounded-lg bg-slate-900 px-4 py-3 text-white">
              Launch Campaign
            </Button>

            <Hr className="my-8 border-slate-200" />

            <Text className="mb-2 text-base leading-8 text-slate-500">
              123 Business Street, Suite 100
              <br />
              City, State 12345
            </Text>

            <Text className="text-base leading-8 text-slate-500">
              <Link href="https://example.com/unsubscribe" className="underline text-slate-500">
                Unsubscribe
              </Link>{" "}
              | © {currentYear} Company Name. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
`;
