"""
Stripe Webhook Handler for Screen Time Journey
Handles Stripe webhooks and stores subscription data in DynamoDB

Key webhook events:
- checkout.session.completed: Create user subscription record
- customer.subscription.updated: Update subscription status
- customer.subscription.deleted: Handle cancellations
- invoice.payment_failed: Handle failed payments
"""

import os
import json
import boto3
import hmac
import hashlib
import stripe
from typing import Dict, Any
from datetime import datetime

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
subscribers_table = dynamodb.Table(os.environ.get('SUBSCRIBERS_TABLE', 'stj_subscribers'))
subscriptions_table = dynamodb.Table(os.environ.get('SUBSCRIPTIONS_TABLE', 'stj_subscriptions'))

# Stripe configuration
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET')

def json_resp(data: Dict[str, Any], status_code: int = 200) -> Dict[str, Any]:
    """Helper to format JSON response"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*'
        },
        'body': json.dumps(data)
    }

def verify_webhook_signature(payload: str, signature: str) -> bool:
    """Verify Stripe webhook signature for security"""
    if not STRIPE_WEBHOOK_SECRET:
        print("⚠️ STRIPE_WEBHOOK_SECRET not configured - skipping verification")
        return True
        
    try:
        stripe.Webhook.construct_event(payload, signature, STRIPE_WEBHOOK_SECRET)
        return True
    except ValueError:
        print("❌ Invalid webhook payload")
        return False
    except stripe.error.SignatureVerificationError:
        print("❌ Invalid webhook signature")
        return False

def handle_checkout_completed(session: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle checkout.session.completed webhook
    Creates subscription record in DynamoDB
    """
    try:
        customer_email = session.get('customer_details', {}).get('email')
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')
        metadata = session.get('metadata', {})
        
        if not customer_email:
            return json_resp({'error': 'No customer email found'}, 400)
            
        # Get subscription details from Stripe
        subscription = stripe.Subscription.retrieve(subscription_id) if subscription_id else None
        
        subscription_record = {
            'customer_id': customer_id,
            'email': customer_email,
            'subscription_id': subscription_id,
            'stripe_session_id': session['id'],
            'status': subscription['status'] if subscription else 'active',
            'plan': metadata.get('plan', 'premium'),
            'currency': metadata.get('currency', 'eur'),
            'price_id': subscription['items']['data'][0]['price']['id'] if subscription else metadata.get('price_id'),
            'created_at': datetime.utcnow().isoformat(),
            'payment_source': 'stripe',
            'country': metadata.get('country', 'unknown'),
            'source': metadata.get('source', 'marketing-site')
        }
        
        # Store in subscriptions table
        subscriptions_table.put_item(Item=subscription_record)
        
        # Also store in legacy subscribers table for compatibility
        subscriber_record = {
            'email': customer_email,
            'phone': metadata.get('phone', ''),
            'name': session.get('customer_details', {}).get('name', ''),
            'subscription_source': 'stripe',
            'stripe_customer_id': customer_id,
            'stripe_subscription_id': subscription_id,
            'plan': metadata.get('plan', 'premium'),
            'status': 'active',
            'created_at': datetime.utcnow().isoformat(),
            'whatsapp_notifications': True,  # Default to enabled
            'country': metadata.get('country', 'DE'),  # Default to Germany for EUR
        }
        
        subscribers_table.put_item(Item=subscriber_record)
        
        print(f"✅ Subscription created for {customer_email} - {subscription_id}")
        
        return json_resp({
            'success': True,
            'message': 'Subscription record created',
            'customer_email': customer_email,
            'subscription_id': subscription_id
        })
        
    except Exception as e:
        print(f"❌ Error handling checkout completed: {str(e)}")
        return json_resp({'error': str(e)}, 500)

def handle_subscription_updated(subscription: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle customer.subscription.updated webhook
    Updates subscription status in DynamoDB
    """
    try:
        subscription_id = subscription['id']
        status = subscription['status']
        
        # Update subscriptions table
        subscriptions_table.update_item(
            Key={'subscription_id': subscription_id},
            UpdateExpression='SET #status = :status, updated_at = :updated_at',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': status,
                ':updated_at': datetime.utcnow().isoformat()
            }
        )
        
        # Update legacy subscribers table
        subscribers_table.update_item(
            Key={'stripe_subscription_id': subscription_id},
            UpdateExpression='SET #status = :status, updated_at = :updated_at',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': status,
                ':updated_at': datetime.utcnow().isoformat()
            }
        )
        
        print(f"✅ Subscription {subscription_id} updated to status: {status}")
        
        return json_resp({
            'success': True,
            'message': f'Subscription updated to {status}',
            'subscription_id': subscription_id
        })
        
    except Exception as e:
        print(f"❌ Error handling subscription updated: {str(e)}")
        return json_resp({'error': str(e)}, 500)

def handle_subscription_deleted(subscription: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle customer.subscription.deleted webhook
    Marks subscription as cancelled
    """
    try:
        subscription_id = subscription['id']
        
        # Update subscriptions table
        subscriptions_table.update_item(
            Key={'subscription_id': subscription_id},
            UpdateExpression='SET #status = :status, cancelled_at = :cancelled_at',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': 'cancelled',
                ':cancelled_at': datetime.utcnow().isoformat()
            }
        )
        
        # Update legacy subscribers table  
        subscribers_table.update_item(
            Key={'stripe_subscription_id': subscription_id},
            UpdateExpression='SET #status = :status, cancelled_at = :cancelled_at',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': 'cancelled',
                ':cancelled_at': datetime.utcnow().isoformat()
            }
        )
        
        print(f"✅ Subscription {subscription_id} cancelled")
        
        return json_resp({
            'success': True,
            'message': 'Subscription cancelled',
            'subscription_id': subscription_id
        })
        
    except Exception as e:
        print(f"❌ Error handling subscription deleted: {str(e)}")
        return json_resp({'error': str(e)}, 500)

def handle_payment_failed(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle invoice.payment_failed webhook
    Updates subscription status and sends notification
    """
    try:
        subscription_id = invoice.get('subscription')
        customer_id = invoice.get('customer')
        
        if subscription_id:
            # Update subscription status
            subscriptions_table.update_item(
                Key={'subscription_id': subscription_id},
                UpdateExpression='SET #status = :status, payment_failed_at = :failed_at',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={
                    ':status': 'past_due',
                    ':failed_at': datetime.utcnow().isoformat()
                }
            )
            
            # Update legacy table
            subscribers_table.update_item(
                Key={'stripe_subscription_id': subscription_id},
                UpdateExpression='SET #status = :status, payment_failed_at = :failed_at',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={
                    ':status': 'past_due',
                    ':failed_at': datetime.utcnow().isoformat()
                }
            )
            
            print(f"✅ Payment failed for subscription {subscription_id}")
        
        return json_resp({
            'success': True,
            'message': 'Payment failure recorded',
            'subscription_id': subscription_id
        })
        
    except Exception as e:
        print(f"❌ Error handling payment failed: {str(e)}")
        return json_resp({'error': str(e)}, 500)

def lambda_handler(event, context):
    """
    Main Lambda handler for Stripe webhooks
    Route: POST /api/stripe/webhook
    """
    try:
        print(f"🎯 Stripe webhook received: {event.get('httpMethod')} {event.get('path')}")
        
        # Only handle POST requests
        if event.get('httpMethod') != 'POST':
            return json_resp({'error': 'Method not allowed'}, 405)
        
        # Get request body and signature
        body = event.get('body', '')
        signature = event.get('headers', {}).get('stripe-signature', '')
        
        if not body:
            return json_resp({'error': 'Empty request body'}, 400)
        
        # Verify webhook signature
        if not verify_webhook_signature(body, signature):
            return json_resp({'error': 'Invalid signature'}, 400)
        
        # Parse webhook payload
        try:
            webhook_data = json.loads(body)
        except json.JSONDecodeError:
            return json_resp({'error': 'Invalid JSON payload'}, 400)
        
        event_type = webhook_data.get('type')
        event_data = webhook_data.get('data', {}).get('object', {})
        
        print(f"📩 Processing webhook: {event_type}")
        
        # Route to appropriate handler
        if event_type == 'checkout.session.completed':
            return handle_checkout_completed(event_data)
        elif event_type == 'customer.subscription.updated':
            return handle_subscription_updated(event_data)
        elif event_type == 'customer.subscription.deleted':
            return handle_subscription_deleted(event_data)
        elif event_type == 'invoice.payment_failed':
            return handle_payment_failed(event_data)
        else:
            print(f"ℹ️ Unhandled webhook event: {event_type}")
            return json_resp({
                'success': True,
                'message': f'Webhook {event_type} received but not processed'
            })
    
    except Exception as e:
        print(f"❌ Webhook handler error: {str(e)}")
        return json_resp({'error': 'Internal server error'}, 500)

# For local testing
if __name__ == '__main__':
    test_event = {
        'httpMethod': 'POST',
        'path': '/api/stripe/webhook',
        'body': json.dumps({
            'type': 'checkout.session.completed',
            'data': {
                'object': {
                    'id': 'cs_test_123',
                    'customer': 'cus_test_123',
                    'subscription': 'sub_test_123',
                    'customer_details': {
                        'email': 'test@example.com',
                        'name': 'Test User'
                    },
                    'metadata': {
                        'plan': 'premium',
                        'currency': 'eur',
                        'country': 'DE'
                    }
                }
            }
        }),
        'headers': {
            'stripe-signature': 'test'
        }
    }
    
    result = lambda_handler(test_event, None)
    print(json.dumps(result, indent=2))