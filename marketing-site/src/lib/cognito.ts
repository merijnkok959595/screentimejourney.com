import { Amplify } from 'aws-amplify';

// Configure AWS Amplify for marketing site
Amplify.configure({
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
    }
  }
});

export const COGNITO_CONFIG = {
  REGION: process.env.NEXT_PUBLIC_AWS_REGION,
  USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
  USER_POOL_CLIENT_ID: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
  DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.screentimejourney.com',
  isConfigured: Boolean(
    process.env.NEXT_PUBLIC_AWS_REGION && 
    process.env.NEXT_PUBLIC_USER_POOL_ID && 
    process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID
  )
};

// User creation interface
export interface CreateUserData {
  email: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  plan: string;
  source: 'marketing-site';
}

// Generate temporary password for user
export const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  
  // Ensure complexity requirements
  password += 'A'; // uppercase
  password += 'a'; // lowercase  
  password += '1'; // number
  password += '@'; // special char
  
  // Add remaining random characters
  for (let i = 4; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
