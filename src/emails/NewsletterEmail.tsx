import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Link,
  Hr,
  Text,
  Tailwind,
} from '@react-email/components';

interface NewsletterEmailProps {
  subject: string;
  title: string;
  content: string[];
}

export const NewsletterEmail = ({
  subject = 'Latest Updates from Alpha Spark',
  title = 'Alpha Spark News',
  content = ['Welcome to our latest newsletter!'],
}: NewsletterEmailProps) => {
  const previewText = subject;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#0b0c10] my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#ffffff1a] rounded my-[40px] mx-auto p-[20px] w-[600px] max-w-full">
            <Section className="mt-[20px] mb-[20px] text-center">
              <Img
                src="https://raw.githubusercontent.com/Icedmist/alpha-website/main/public/assets/logo.png"
                width="100"
                alt="Alpha Spark"
                className="my-0 mx-auto"
              />
            </Section>
            
            <Heading className="text-[#0099CC] text-[20px] font-black text-center p-0 my-[20px] mx-0 uppercase tracking-widest italic">
              {title}
            </Heading>

            <Section className="bg-[#1f2833] p-6 rounded-xl border border-white/5">
              {content.map((paragraph, idx) => (
                <Text key={idx} className="text-[#c5c6c7] text-[15px] leading-[26px] mb-4 last:mb-0">
                  {paragraph}
                </Text>
              ))}
            </Section>

            <Hr className="border border-solid border-[#ffffff1a] my-[26px] mx-0 w-full" />
            
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              You are receiving this email because you opted in to Alpha Spark Academy updates.
              <br />
              &copy; {new Date().getFullYear()} Alpha Spark Academy. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewsletterEmail;
