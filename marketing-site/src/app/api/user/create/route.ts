import { NextRequest, NextResponse } from 'next/server';
import { CreateUserData, COGNITO_CONFIG } from '@/lib/cognito';
import { createCognitoUser } from '@/lib/cognito-integration';

export async function POST(request: NextRequest) {
  try {
    const userData: CreateUserData = await request.json();
    
    if (!userData.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🎯 Creating user account for:', userData.email);
    console.log('💳 Stripe Customer ID:', userData.stripeCustomerId);
    console.log('📊 Subscription ID:', userData.stripeSubscriptionId);

    if (!COGNITO_CONFIG.isConfigured) {
      console.log('⚠️ Cognito not configured, using fallback');
      
      return NextResponse.json({
        success: true,
        cognitoNotConfigured: true,
        user: { 
          email: userData.email,
          manualSetup: true
        },
        dashboardUrl: `${COGNITO_CONFIG.DASHBOARD_URL}?email=${encodeURIComponent(userData.email)}&manual=true`,
        message: 'Payment successful! Please sign up on the dashboard to access your account.',
        instructions: 'Visit your dashboard and create an account with the same email address used for payment.'
      });
    }

    // Create user in AWS Cognito
    try {
      const cognitoResult = await createCognitoUser(userData);
      
      if (!cognitoResult.success) {
        if (cognitoResult.existingUser) {
          // User already exists - redirect to dashboard with sign-in prompt
          return NextResponse.json({
            success: true,
            existingUser: true,
            user: { email: userData.email },
            dashboardUrl: `${COGNITO_CONFIG.DASHBOARD_URL}?email=${encodeURIComponent(userData.email)}&existing=true`,
            message: 'Great! You already have an account. Please sign in to your dashboard.'
          });
        }
        
        throw new Error(cognitoResult.error);
      }

      // Success - new user created
      console.log('✅ Cognito user created successfully');
      return NextResponse.json({
        success: true,
        user: cognitoResult.user,
        dashboardUrl: `${COGNITO_CONFIG.DASHBOARD_URL}?email=${encodeURIComponent(userData.email)}&temp_password=${encodeURIComponent(cognitoResult.user.temporaryPassword)}&new_user=true`,
        message: 'Account created successfully! Redirecting to your dashboard...'
      });

    } catch (cognitoError: any) {
      // If Cognito fails, still return success with manual instructions
      console.error('❌ Cognito creation failed:', cognitoError);
      
      return NextResponse.json({
        success: true,
        cognitoFailed: true,
        user: { 
          email: userData.email,
          manualSetup: true
        },
        dashboardUrl: `${COGNITO_CONFIG.DASHBOARD_URL}?email=${encodeURIComponent(userData.email)}&manual=true`,
        message: 'Payment successful! Please visit your dashboard to complete account setup.',
        instructions: 'Visit your dashboard and create an account with this email address.',
        supportEmail: 'support@screentimejourney.com'
      });
    }

  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
