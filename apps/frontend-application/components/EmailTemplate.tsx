import * as React from 'react';

interface EmailTemplateProps {
    email: string;
    token: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    email,
    token,
}) => {
    const verificationLink = `http://localhost:3500/auth/verify?token=${token}`;

    return (
        <div style={{
            fontFamily: 'sans-serif',
            color: '#1a202c',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            lineHeight: '1.6'
        }}>
            <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#2563eb'
            }}>Account Verification</h1>

            <p style={{ marginTop: '16px' }}>Hello!!</p>

            <p style={{ marginTop: '8px' }}>
                We received a request to verify your email address: <span style={{ fontWeight: 600 }}>{email}</span>.
            </p>

            <p style={{ marginTop: '8px' }}>
                Please click the link below to verify your account and complete the registration process:
            </p>

            <a
                href={verificationLink}
                style={{
                    display: 'inline-block',
                    marginTop: '16px',
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '6px',
                    textDecoration: 'none'
                }}
            >
                Verify your account
            </a>

            <p style={{
                marginTop: '24px',
                fontSize: '14px',
                color: '#4b5563'
            }}>
                If you didn&apos;t request this, you can safely ignore this email.
            </p>

            <p style={{ marginTop: '16px', fontSize: '14px' }}>
                Best regards,<br />
                The Team
            </p>

            <p style={{
                fontSize: '12px',
                color: '#4b5563',
                marginTop: '8px'
            }}>support@carmen.com</p>
        </div>

    );
};