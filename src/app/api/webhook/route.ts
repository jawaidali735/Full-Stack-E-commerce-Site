import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Metadata } from "../../../../actions/createCheckoutSession";
import { backendClient } from "@/sanity/lib/backendClient";
import crypto from "crypto"; // Required for generating unique keys

// POST function to handle the webhook from Stripe
export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    // Check if the Stripe signature is present
    if (!sig) {
        return NextResponse.json({ error: 'No Stripe signature' }, { status: 400 });
    }
    // process.env.STRIPE_WEBHOOK_SECRET use this for localhost
    const weebhookSecret = "whsec_mjPPpe9974euGybR5QbsbHkAANuMSNkB";
    // Check if the Stripe webhook secret is available
    if (!weebhookSecret) {
        console.error('Stripe webhook secret is not set');
        return NextResponse.json({ error: 'Stripe webhook secret is not set' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        // Validate the event from Stripe
        event = stripe.webhooks.constructEvent(body, sig, weebhookSecret);
    } catch (error) {
        console.error('Webhook event error', error);
        return NextResponse.json({ error: `Webhook Error ${error}` }, { status: 400 });
    }

    // Handle the 'checkout.session.completed' event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        try {
            // Call the createOrderInSanity function to create the order in Sanity
            await createOrderInSanity(session);
        } catch (error) {
            console.error('Error creating order in Sanity', error);
            return NextResponse.json({ error: `Order creation failed in Sanity: ${error}` }, { status: 500 });
        }
    }
    return NextResponse.json({ received: true });
}

// Function to create the order in Sanity
async function createOrderInSanity(session: Stripe.Checkout.Session) {
    console.log("Creating order for session:", session);

    const { id, amount_total, currency, metadata, payment_intent, total_details } = session;

    // Ensure metadata is present
    if (!metadata) throw new Error("Session metadata is missing.");

    // Destructure the required metadata fields
    const {
        orderNumber,
        customerName,
        customerEmail,
        clerkUserId,
        shipmentId,
    } = metadata as unknown as Metadata;

    // Step 1: Fetch line items with expanded product data from Stripe
    const lineItemsWithProduct = await stripe.checkout.sessions
        .listLineItems(id, { expand: ["data.price.product"] })
        .catch((err) => {
            console.error("Error fetching line items:", err);
            throw new Error("Failed to fetch line items.");
        });

    // Step 2: Prepare the product data for Sanity
    const sanityProducts = lineItemsWithProduct.data.map((item) => {
        const productId = (item.price?.product as Stripe.Product)?.metadata?.id;
        if (!productId) {
            console.error("Product metadata ID is missing for item:", item);
            throw new Error("Product metadata ID is missing.");
        }
        return {
            _key: crypto.randomUUID(),
            product: {
                _type: "reference",
                _ref: productId, // Reference to the Sanity product
            },
            quantity: item?.quantity || 0,
        };
    });

    console.log("Sanity Products:", sanityProducts);

    // Step 3: Create the order document in Sanity
    const order = await backendClient.create({
        _type: "order", // Sanity schema type
        orderNumber, // Unique order number
        stripeCheckoutSessionId: id, // Stripe session ID
        stripePaymentIntentId: payment_intent, // Stripe payment intent ID
        customerName, // Customer's name
        stripeCustomerId: customerEmail, // Customer's email
        clerkUserId, // Clerk user ID
        email: customerEmail, // Customer's email
        shipment: {
            _type: "reference",  // Reference to the shipment document
            _ref: shipmentId,    // Reference to the shipment document using the shipmentId
        },
        currency, // Currency of the payment
        amountDiscount: total_details?.amount_discount
            ? total_details.amount_discount / 100
            : 0, // Convert discount amount to dollars
        products: sanityProducts, // List of products in the order
        totalPrice: amount_total ? amount_total / 100 : 0, // Convert total amount to dollars
        status: "paid", // Set the status of the order
        orderDate: new Date().toISOString(), // Current date/time as order date
    });

    console.log("Order created in Sanity:", order);
    return order;
}











// async function createOrderInSanity(session: Stripe.Checkout.Session) {
//     const { id, amount_total, currency, metadata, payment_intent, total_details } = session
//     const { orderNumber, customerName, customerEmail, clerkUserId  } = metadata as unknown as Metadata;

//     const linItemsWithProduct = await stripe.checkout.sessions.listLineItems(id, {expand: ['data.price.product']});

//     const sanityProducts = linItemsWithProduct.data.map((item)=>({
//         _key:crypto.randomUUID(),
//         product: {
//             _type: "reference",
//             _ref:(item.price?.product as Stripe.Product)?.metadata?.id,
//         },
//         quantity:item?.quantity || 0,
//     }));

//     const order =await backendClient.create({
//         _type:"order",
//         orderNumber,
//         stripeCheckoutSessionId:id,
//         stripePaymentIntentId:payment_intent,
//         customerName,
//         stripeCustomerId:customerEmail,
//         clerkUserId:clerkUserId,
//         email:customerEmail,
//         currency,
//         amountDiscount:total_details?.amount_discount ? total_details.amount_discount / 100 : 0,
//         products:sanityProducts,
//         totalPrice:amount_total?amount_total/100:0,
//         status:'paid',
//         orderDate:new Date().toISOString(),
//     });
//     return order
// }
