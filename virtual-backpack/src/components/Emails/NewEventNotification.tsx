import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NewEventNotificationProps {
  title?: string;
  date?: string;
  description?: string;
}

export const NewEventNotification = ({
  title = "New Event Created",
  date = "",
  description = "",
}: NewEventNotificationProps) => (
  <Html>
    <Head />
    <Preview>A new event has been added to your calendar</Preview>
    <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
      <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '20px', borderRadius: '5px' }}>
        <Heading style={{ color: '#333', fontSize: '20px' }}>New Calendar Event!</Heading>
        <Text style={{ color: '#555', fontSize: '16px' }}>
          A new event has been successfully added to your Virtual Backpack calendar.
        </Text>
        <Text style={{ color: '#333', fontWeight: 'bold' }}>
          Title: {title}
        </Text>
        <Text style={{ color: '#333', fontWeight: 'bold' }}>
          Date: {date}
        </Text>
        {description && (
          <Text style={{ color: '#555' }}>
            <strong>Description:</strong> {description}
          </Text>
        )}
        <Text style={{ color: '#888', fontSize: '12px', marginTop: '20px' }}>
          This is an automated notification from your Virtual Backpack.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NewEventNotification;