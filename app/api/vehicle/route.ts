import { NextRequest, NextResponse } from "next/server";

const REGCHECK_API =
  "https://www.regcheck.org.uk/api/reg.asmx";

type VehicleData = {
  Description?: string;
  RegistrationYear?: string;
  CarMake?: {
    CurrentTextValue?: string;
  };
  CarModel?: {
    CurrentTextValue?: string;
  };
  MakeDescription?: {
    CurrentTextValue?: string;
  };
  ModelDescription?: {
    CurrentTextValue?: string;
  };
  EngineSize?: {
    CurrentTextValue?: string;
  };
  BodyStyle?: {
    CurrentTextValue?: string;
  };
  FuelType?: {
    CurrentTextValue?: string;
  };
  Variant?: string;
  Colour?: string;
  VehicleIdentificationNumber?: string;
  EngineNumber?: string;
  ImageUrl?: string;
};

function cleanValue(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isUnknown(value: unknown): boolean {
  const cleaned = cleanValue(value).toUpperCase();

  return (
    cleaned === "" ||
    cleaned === "UNKNOWN" ||
    cleaned === "N/A" ||
    cleaned === "NULL"
  );
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function hasRealVehicleData(
  vehicle: VehicleData
): boolean {
  const make =
    vehicle.CarMake?.CurrentTextValue;

  const model =
    vehicle.CarModel?.CurrentTextValue;

  const makeDescription =
    vehicle.MakeDescription?.CurrentTextValue;

  const modelDescription =
    vehicle.ModelDescription?.CurrentTextValue;

  const description =
    vehicle.Description;

  const hasMake = !isUnknown(make);
  const hasModel = !isUnknown(model);

  const hasMakeDescription =
    !isUnknown(makeDescription);

  const hasModelDescription =
    !isUnknown(modelDescription);

  const hasDescription =
    !isUnknown(description) &&
    !description
      ?.toUpperCase()
      .includes("UNKNOWN");

  return (
    (hasMake && hasModel) ||
    (hasMakeDescription && hasModelDescription) ||
    hasDescription
  );
}

export async function GET(
  request: NextRequest
) {
  /*
   * IMPORTANT:
   *
   * When the application is running on Vercel,
   * the public vehicle lookup is disabled.
   *
   * This protects your RegCheck credits while
   * you share the public website with friends.
   *
   * Your local localhost development environment
   * continues to work normally.
   */
  if (process.env.VERCEL === "1") {
    return NextResponse.json(
      {
        success: false,
        error:
          "Vehicle lookup is temporarily unavailable.",
      },
      { status: 503 }
    );
  }

  try {
    const { searchParams } =
      new URL(request.url);

    const registration =
      searchParams
        .get("registration")
        ?.trim()
        .toUpperCase();

    const country =
      searchParams
        .get("country")
        ?.trim()
        .toUpperCase();

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a registration number.",
        },
        { status: 400 }
      );
    }

    if (
      country !== "UK" &&
      country !== "IRELAND"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Vehicle lookup currently supports the UK and Ireland.",
        },
        { status: 400 }
      );
    }

    const username =
      process.env.REGCHECK_USERNAME;

    if (!username) {
      console.error(
        "REGCHECK_USERNAME is missing from .env.local"
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Vehicle lookup is not configured correctly.",
        },
        { status: 500 }
      );
    }

    const endpoint =
      country === "IRELAND"
        ? "CheckIreland"
        : "Check";

    const params = new URLSearchParams();

    params.set(
      "RegistrationNumber",
      registration
    );

    params.set(
      "username",
      username
    );

    const apiUrl =
      `${REGCHECK_API}/${endpoint}?${params.toString()}`;

    console.log(
      `Vehicle lookup: ${country} ${registration}`
    );

    const response = await fetch(
      apiUrl,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `RegCheck returned HTTP ${response.status}`
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "The vehicle data service is temporarily unavailable. Please try again.",
        },
        { status: 502 }
      );
    }

    const xml =
      await response.text();

    const vehicleJsonMatch =
      xml.match(
        /<vehicleJson>([\s\S]*?)<\/vehicleJson>/i
      );

    if (!vehicleJsonMatch) {
      console.error(
        "RegCheck response did not contain vehicleJson."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "We couldn't find a vehicle with that registration.",
        },
        { status: 404 }
      );
    }

    const rawVehicleJson =
      decodeXmlEntities(
        vehicleJsonMatch[1]
      );

    let vehicle: VehicleData;

    try {
      vehicle =
        JSON.parse(rawVehicleJson);
    } catch (parseError) {
      console.error(
        "Could not parse RegCheck vehicle JSON:",
        parseError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "The vehicle service returned invalid data. Please try again.",
        },
        { status: 502 }
      );
    }

    /*
     * RegCheck can return a technically successful
     * response containing UNKNOWN values.
     *
     * Do not display those responses as genuine
     * vehicle results.
     */

    if (!hasRealVehicleData(vehicle)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "We couldn't find a vehicle with that registration. Please check the registration and try again.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      country,
      registration,
      vehicle,
    });
  } catch (error) {
    console.error(
      "Vehicle lookup failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while looking up the vehicle. Please try again.",
      },
      { status: 500 }
    );
  }
}