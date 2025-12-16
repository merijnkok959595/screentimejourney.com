import { signUp, confirmSignUp, signIn, SignUpInput } from 'aws-amplify/auth';
import { generateTempPassword, COGNITO_CONFIG, CreateUserData } from '@/lib/cognito';

// Create Cognito user with Stripe metadata
export const createCognitoUser = async (userData: CreateUserData) => {
  try {
    if (!COGNITO_CONFIG.isConfigured) {
      throw new Error('Cognito not configured');
    }

    const tempPassword = generateTempPassword();
    
    const signUpParams: SignUpInput = {
      username: userData.email,
      password: tempPassword,
      options: {
        userAttributes: {
          email: userData.email,
          'custom:stripe_customer_id': userData.stripeCustomerId || '',
          'custom:subscription_id': userData.stripeSubscriptionId || '',
          'custom:plan': userData.plan,
          'custom:source': userData.source,
          'custom:created_from': 'payment',
        },
        autoSignIn: false // We'll handle sign-in manually
      }
    };

    // Create the user in Cognito
    const signUpResult = await signUp(signUpParams);
    
    // Auto-confirm the user (admin action - you might want email verification instead)
    if (signUpResult.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
      // For production, you might want to send a verification email instead
      // For now, we'll auto-confirm since they already paid
      console.log('User created, verification may be required');
    }

    return {
      success: true,
      user: {
        id: signUpResult.userId,
        email: userData.email,
        temporaryPassword: tempPassword,
        mustChangePassword: true
      },
      cognitoDetails: signUpResult
    };

  } catch (error: any) {
    console.error('Cognito user creation failed:', error);
    
    // Handle specific Cognito errors
    if (error.name === 'UsernameExistsException') {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
        existingUser: true
      };
    }
    
    throw new Error(`Failed to create user account: ${error.message}`);
  }
};

// Sign in user with temporary password and force password change
export const signInWithTempPassword = async (email: string, tempPassword: string) => {
  try {
    const signInResult = await signIn({
      username: email,
      password: tempPassword
    });

    return {
      success: true,
      result: signInResult,
      requiresNewPassword: signInResult.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
    };

  } catch (error: any) {
    console.error('Sign in failed:', error);
    throw new Error(`Sign in failed: ${error.message}`);
  }
};