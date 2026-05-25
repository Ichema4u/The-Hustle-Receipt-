export async function verifyFlutterwavePayment(
  reference: string,
): Promise<boolean> {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("FLUTTERWAVE_SECRET_KEY not configured");
  }

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${reference}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    if (!response.ok) {
      console.error(`Verification failed with status: ${response.status}`);
      return false;
    }

    const data = await response.json();

    // Check if payment was successful
    if (data.status === "success" && data.data.status === "successful") {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Flutterwave verification error:", error);
    return false;
  }
}

export function generateFlutterwavePayload(
  email: string,
  amount: number,
  reference: string,
  metadata: Record<string, unknown> = {},
) {
  return {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: reference,
    amount: amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: email,
    },
    customizations: {
      title: "The Hustle Receipt",
      description: "Support your favorite creator",
      logo: "https://rd-api-live-public-dev.herokuapp.com/images/hero.png",
    },
    meta: metadata,
  };
}
