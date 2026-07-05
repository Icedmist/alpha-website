import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface WelcomeEmailProps {
  firstName: string;
}

export const WelcomeEmail = ({
  firstName = 'Future Innovator',
}: WelcomeEmailProps) => {
  const previewText = `Welcome to Alpha Spark Academy, ${firstName}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#0b0c10] my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#ffffff1a] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px] text-center">
              <Img
                src="https://raw.githubusercontent.com/Icedmist/alpha-website/main/public/logo.png"
                width="120"
                alt="Alpha Spark Academy"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-[#ff6b35] text-[24px] font-normal text-center p-0 my-[30px] mx-0 font-bold italic uppercase tracking-widest">
              Welcome to the Future
            </Heading>
            <Text className="text-[#c5c6c7] text-[14px] leading-[24px]">
              Dear {firstName},
            </Text>
            <Text className="text-[#c5c6c7] text-[14px] leading-[24px]">
              We have successfully received your application to Alpha Spark Academy.
              You have taken the first step towards transforming your tech career.
            </Text>
            <Text className="text-[#c5c6c7] text-[14px] leading-[24px]">
              Our admission team is reviewing your profile and will get back to you shortly.
              In the meantime, feel free to explore our syllabus and prepare yourself for an incredible journey.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Link
                href="https://wa.me/2348123456789" // Placeholder WhatsApp Number
                className="bg-[#0099CC] rounded-lg text-white text-[12px] font-bold no-underline text-center px-5 py-3 uppercase tracking-wider"
              >
                Message us on WhatsApp
              </Link>
            </Section>
            <Text className="text-[#c5c6c7] text-[14px] leading-[24px]">
              Stay hungry,<br />
              The Alpha Spark Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
