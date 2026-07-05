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

interface ReferralEmailProps {
  friendName: string;
  referrerName: string;
}

export const ReferralEmail = ({
  friendName = 'Friend',
  referrerName = 'A friend',
}: ReferralEmailProps) => {
  const previewText = `${referrerName} has invited you to join Alpha Spark Academy!`;

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
            <Heading className="text-[#3bb75e] text-[24px] font-normal text-center p-0 my-[30px] mx-0 font-bold italic uppercase tracking-widest">
              You're Invited!
            </Heading>
            <Text className="text-[#c5c6c7] text-[14px] leading-[24px]">
              Hi {friendName},
            </Text>
            <Text className="text-[#c5c6c7] text-[14px] leading-[24px]">
              <strong>{referrerName}</strong> thinks you'd be a great fit for Alpha Spark Academy and has invited you to check us out.
            </Text>
            <Text className="text-[#c5c6c7] text-[14px] leading-[24px]">
              Alpha Spark Academy is an elite technology training platform that builds workforce infrastructure and practical skills for the digital age.
            </Text>
            
            <Section className="text-center mt-[32px] mb-[32px]">
              <Link
                href="https://alphaspark.ng"
                className="bg-[#3bb75e] rounded-lg text-[#0b0c10] text-[12px] font-black no-underline text-center px-6 py-3 uppercase tracking-wider"
              >
                Join the Academy
              </Link>
            </Section>
            
            <Hr className="border border-solid border-[#ffffff1a] my-[26px] mx-0 w-full" />
            
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              If you don't know {referrerName}, please ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ReferralEmail;
