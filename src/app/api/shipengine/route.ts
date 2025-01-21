// import shipengine from "@/lib/shipEngine";
import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest } from "next/server";

export async function GET() {
  return new Response(JSON.stringify({ message: "Shipengine Testing" }));
}

export async function POST(req: NextRequest) {
  const { shipToAddress } = await req.json();

  try {

    // const shipmentDetails = await shipengine.getRatesWithShipmentDetails({
    //   shipment: {
    //     shipTo: shipToAddress,
    //     shipFrom: {
    //       name: "Jawaid Ali",
    //       phone: "0317******",
    //       addressLine1: "Address 1",
    //       addressLine2: "Address 2",
    //       cityLocality: "Karachi",
    //       stateProvince: "IL",
    //       postalCode: "12345",
    //       countryCode: "PK",
    //       addressResidentialIndicator: "no",
    //     },
    //     packages: packages,
    //   },
    //   rateOptions: {
    //     carrierIds: [
    //       process.env.SHIPEENGIN_FIRST_COURIER || "",
    //       process.env.SHIPEENGIN_SECOND_COURIER || "",
    //       process.env.SHIPEENGIN_THIRD_COURIER || "",
    //       process.env.SHIPEENGIN_FOURTH_COURIER || "",
    //     ].filter(Boolean),
    //   },
    // });

   


    const sanityResponse = await backendClient.create({
      _type: "shipment", // Sanity schema type
      shipToAddress, // Include shipToAddress data
      // Include packages data
      shipFromAddress: {
        name: "Jawaid Ali",
        phone: "0317******",
        addressLine1: "Address 1",
        addressLine2: "Address 2",
        cityLocality: "Karachi",
        stateProvince: "IL",
        postalCode: "12345",
        countryCode: "PK",
        addressResidentialIndicator: "no",
      },
       // Include the response from ShipEngine
      createdAt: new Date().toISOString(), // Timestamp
    });

    // Step 4: Return the shipment's _id to the client
    return new Response(
      JSON.stringify({
        message: "Shipment created successfully",
        shipmentId: sanityResponse._id, // Return the unique _id of the shipment document
      }),
      { status: 201 }
    );
  } catch (error) {
    // Handle errors
    console.error("Error occurred:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create shipment" }),
      { status: 500 }
    );
  }
}
