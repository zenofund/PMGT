import { env } from './env';

export const paystackConfig = {
  publicKey: env.paystack.publicKey,
  secretKey: env.paystack.secretKey,
  baseUrl: 'https://api.paystack.co',
};

export interface PaystackPlan {
  id: string;
  name: string;
  amount: number;
  interval: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
  currency: string;
}

export interface PaystackTransaction {
  reference: string;
  amount: number;
  email: string;
  customFields?: Record<string, any>;
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    status: string;
    paidAt: string;
  };
}

export const initializePaystackPayment = async (
  transaction: PaystackTransaction
): Promise<{ authorizationUrl: string; accessCode: string; reference: string } | null> => {
  if (!paystackConfig.secretKey) {
    console.error('Paystack secret key not configured');
    return null;
  }

  try {
    const response = await fetch(`${paystackConfig.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${paystackConfig.secretKey}`,
      },
      body: JSON.stringify(transaction),
    });

    const data = await response.json();
    if (data.status) {
      return {
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
      };
    }
    return null;
  } catch (error) {
    console.error('Paystack initialization error:', error);
    return null;
  }
};

export const verifyPaystackTransaction = async (
  reference: string
): Promise<PaystackVerifyResponse | null> => {
  if (!paystackConfig.secretKey) {
    console.error('Paystack secret key not configured');
    return null;
  }

  try {
    const response = await fetch(`${paystackConfig.baseUrl}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackConfig.secretKey}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Paystack verification error:', error);
    return null;
  }
};
