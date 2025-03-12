import React from 'react'

interface Props {
    email: string;
    token: string;
}

const EmailPasswordRecovery: React.FC<Props> = ({
    email, token
}) => {
    const recoveryLink = `http://localhost:3500/auth/recover?token=${token}`;

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
                color: '#e53e3e'
            }}>Password Recovery</h1>

            <p style={{ marginTop: '16px' }}>Hello,</p>

            <p style={{ marginTop: '8px' }}>
                We received a request to reset the password for your account associated with the email:
                <span style={{ fontWeight: 600 }}>{email}</span>.
            </p>

            <p style={{ marginTop: '8px' }}>
                Please click the link below to reset your password. This link will expire in 24 hours:
            </p>

            <a
                href={recoveryLink}
                style={{
                    display: 'inline-block',
                    marginTop: '16px',
                    padding: '8px 16px',
                    backgroundColor: '#e53e3e',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '6px',
                    textDecoration: 'none'
                }}
            >
                Reset your password
            </a>

            <p style={{
                marginTop: '24px',
                fontSize: '14px',
                color: '#4b5563'
            }}>
                If you didn&apos;t request a password reset, you can safely ignore this email. Your password will remain the same.
            </p>

            <p style={{ marginTop: '16px', fontSize: '14px' }}>
                Best regards,<br />
                The Support Team
            </p>

            <p style={{
                fontSize: '12px',
                color: '#4b5563',
                marginTop: '8px'
            }}>support@carmen.com</p>
        </div>
    )
}

export default EmailPasswordRecovery