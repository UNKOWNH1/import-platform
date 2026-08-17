"use client";

import { useState } from "react";
import { GB, IE, JP } from "country-flag-icons/react/3x2";

type Country = "UK" | "IRELAND" | "JAPAN";

const countries: Record<
  Country,
  {
    name: string;
    code: string;
    flag: typeof GB;
  }
> = {
  UK: {
    name: "United Kingdom",
    code: "GB",
    flag: GB,
  },
  IRELAND: {
    name: "Ireland",
    code: "IE",
    flag: IE,
  },
  JAPAN: {
    name: "Japan",
    code: "JP",
    flag: JP,
  },
};

/*
  Phase 1 valid import routes.

  UK       → Ireland
  Ireland  → UK
  Japan    → Ireland
  Japan    → UK
*/
const validDestinations: Record<Country, Country[]> = {
  UK: ["IRELAND"],
  IRELAND: ["UK"],
  JAPAN: ["IRELAND", "UK"],
};

function CountryDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: Country;
  options: Country[];
  onChange: (country: Country) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCountry = countries[value];
  const SelectedFlag = selectedCountry.flag;

  function handleSelect(country: Country) {
    onChange(country);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <label className="mb-2 block text-sm text-zinc-400">
        {label}
      </label>

      {/* Selected country */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-16 w-full items-center justify-between rounded-xl border px-4 text-left transition ${
          isOpen
            ? "border-blue-500 bg-blue-500/10"
            : "border-white/10 bg-white/[0.03] hover:border-white/20"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Flag */}
          <div className="h-8 w-11 shrink-0 overflow-hidden rounded-md border border-white/10">
            <SelectedFlag
              title={selectedCountry.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Country information */}
          <div>
            <p className="text-sm font-medium text-white">
              {selectedCountry.name}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {selectedCountry.code}
            </p>
          </div>
        </div>

        {/* Dropdown arrow */}
        <span
          className={`ml-4 text-xs text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#17191f] p-1 shadow-2xl shadow-black/40"
        >
          {options.map((country) => {
            const option = countries[country];
            const OptionFlag = option.flag;
            const selected = country === value;

            return (
              <button
                key={country}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => handleSelect(country)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition ${
                  selected
                    ? "bg-blue-500/10"
                    : "hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-11 shrink-0 overflow-hidden rounded-md border border-white/10">
                    <OptionFlag
                      title={option.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {option.name}
                    </p>

                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      {option.code}
                    </p>
                  </div>
                </div>

                {selected && (
                  <span className="text-sm font-semibold text-blue-400">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [importFrom, setImportFrom] = useState<Country>("UK");
  const [importTo, setImportTo] =
    useState<Country>("IRELAND");

  const [vehicleInput, setVehicleInput] = useState("");

  const fromCountry = countries[importFrom];
  const toCountry = countries[importTo];

  const FromFlag = fromCountry.flag;
  const ToFlag = toCountry.flag;

  const destinationOptions =
    validDestinations[importFrom];

  /*
    When the user changes the origin, make sure the destination
    is always a valid destination for that origin.
  */
  function handleOriginChange(country: Country) {
    setImportFrom(country);

    const destinations = validDestinations[country];

    if (!destinations.includes(importTo)) {
      setImportTo(destinations[0]);
    }
  }

  function getVehiclePlaceholder() {
    if (importFrom === "UK") {
      return "Enter UK registration";
    }

    if (importFrom === "JAPAN") {
      return "Enter VIN or chassis number";
    }

    return "Enter Irish registration or VIN";
  }

  return (
    <main className="min-h-screen bg-[#08090b] text-white">

      {/* =========================================================
          NAVIGATION
      ========================================================= */}

      <nav className="flex h-20 items-center justify-between border-b border-white/10 px-6 md:px-12">

        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight">
          Import<span className="text-blue-500">X</span>
        </div>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">

          <a
            href="#how-it-works"
            className="transition hover:text-white"
          >
            How it works
          </a>

          <a
            href="#costs"
            className="transition hover:text-white"
          >
            Costs
          </a>

          <a
            href="#guides"
            className="transition hover:text-white"
          >
            Guides
          </a>

          <a
            href="#pricing"
            className="transition hover:text-white"
          >
            Pricing
          </a>

        </div>

        {/* Account buttons */}
        <div className="flex items-center gap-3">

          <button
            type="button"
            className="hidden rounded-xl px-4 py-2 text-sm text-zinc-300 transition hover:text-white sm:block"
          >
            Log in
          </button>

          <button
            type="button"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500"
          >
            Sign up
          </button>

        </div>

      </nav>


      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-visible">

        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(37,99,235,0.18),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-2 lg:items-center">


          {/* =====================================================
              HERO TEXT
          ===================================================== */}

          <div>

            {/* Badge */}
            <div className="mb-6 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
              UK & Ireland's vehicle import platform
            </div>

            {/* Main heading */}
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">

              Import your car.

              <br />

              Know the{" "}

              <span className="text-blue-500">
                real cost.
              </span>

            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-400 md:text-xl">
              Calculate the estimated total cost of importing a
              vehicle, including shipping, taxes, registration and
              more.
            </p>

            {/* Benefits */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-zinc-400">

              <div className="flex items-center gap-2">
                <span className="text-green-400">
                  ✓
                </span>

                Accurate estimates
              </div>

              <div className="flex items-center gap-2">
                <span className="text-green-400">
                  ✓
                </span>

                No hidden fees
              </div>

              <div className="flex items-center gap-2">
                <span className="text-green-400">
                  ✓
                </span>

                Downloadable reports
              </div>

            </div>

          </div>


          {/* =====================================================
              CALCULATOR CARD
          ===================================================== */}

          <div className="relative">

            {/* Glow */}
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-blue-600/10 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-[#111318]/95 p-6 shadow-2xl backdrop-blur-xl md:p-8">

              {/* Calculator heading */}
              <div className="mb-7">

                <p className="text-sm font-medium text-zinc-400">
                  Start your calculation
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Where is your car coming from?
                </h2>

              </div>


              {/* =================================================
                  IMPORTING FROM
              ================================================= */}

              <CountryDropdown
                label="Importing from"
                value={importFrom}
                options={[
                  "UK",
                  "JAPAN",
                  "IRELAND",
                ]}
                onChange={handleOriginChange}
              />


              {/* =================================================
                  IMPORTING TO
              ================================================= */}

              <div className="mt-5">

                <CountryDropdown
                  label="Importing to"
                  value={importTo}
                  options={destinationOptions}
                  onChange={setImportTo}
                />

              </div>


              {/* =================================================
                  ROUTE PREVIEW
              ================================================= */}

              <div className="mt-5 flex items-center justify-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">

                {/* Origin */}
                <div className="flex items-center gap-2">

                  <FromFlag
                    title={fromCountry.name}
                    className="h-4 w-6 rounded-sm object-cover"
                  />

                  <span className="text-xs font-medium text-zinc-300">
                    {fromCountry.code}
                  </span>

                </div>

                {/* Arrow */}
                <span className="text-zinc-600">
                  →
                </span>

                {/* Destination */}
                <div className="flex items-center gap-2">

                  <ToFlag
                    title={toCountry.name}
                    className="h-4 w-6 rounded-sm object-cover"
                  />

                  <span className="text-xs font-medium text-zinc-300">
                    {toCountry.code}
                  </span>

                </div>

              </div>


              {/* =================================================
                  VEHICLE INPUT
              ================================================= */}

              <div className="mt-5">

                <label
                  htmlFor="vehicle-input"
                  className="mb-2 block text-sm text-zinc-400"
                >
                  Find your vehicle
                </label>

                <input
                  id="vehicle-input"
                  type="text"
                  value={vehicleInput}
                  onChange={(event) =>
                    setVehicleInput(event.target.value)
                  }
                  placeholder={getVehiclePlaceholder()}
                  autoComplete="off"
                  className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-blue-500 focus:bg-white/[0.04]"
                />

              </div>


              {/* =================================================
                  FIND VEHICLE
              ================================================= */}

              <button
                type="button"
                className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] font-medium transition hover:border-blue-500/40 hover:bg-blue-500/10"
              >
                Find vehicle

                <span>
                  →
                </span>

              </button>


              {/* =================================================
                  CALCULATE
              ================================================= */}

              <button
                type="button"
                className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-medium transition hover:bg-blue-500"
              >
                Calculate my import cost

                <span>
                  →
                </span>

              </button>


              {/* Free notice */}
              <p className="mt-4 text-center text-xs text-zinc-600">
                Free to calculate. No credit card required.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          TRUST BAR
      ========================================================= */}

      <section className="border-y border-white/10 bg-white/[0.015]">

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-7 md:grid-cols-4 md:px-12">


          {/* Tax */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-blue-400">
              ✓
            </div>

            <div>

              <p className="text-sm font-medium">
                Tax calculations
              </p>

              <p className="text-xs text-zinc-500">
                Built around current rules
              </p>

            </div>

          </div>


          {/* Shipping */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-blue-400">
              🚢
            </div>

            <div>

              <p className="text-sm font-medium">
                Shipping estimates
              </p>

              <p className="text-xs text-zinc-500">
                Know your transport costs
              </p>

            </div>

          </div>


          {/* Landed cost */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-blue-400">
              €
            </div>

            <div>

              <p className="text-sm font-medium">
                Total landed cost
              </p>

              <p className="text-xs text-zinc-500">
                See the complete picture
              </p>

            </div>

          </div>


          {/* Reports */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-blue-400">
              📄
            </div>

            <div>

              <p className="text-sm font-medium">
                Professional reports
              </p>

              <p className="text-xs text-zinc-500">
                Download and share
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32"
      >

        <div className="max-w-2xl">

          <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
            How it works
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Importing a car shouldn't be complicated.
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-400">
            We take all the complicated calculations and turn
            them into a simple step-by-step experience.
          </p>

        </div>


        <div className="mt-16 grid gap-6 md:grid-cols-3">


          {/* Step 1 */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

            <div className="text-sm font-medium text-blue-400">
              01
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              Find your car
            </h3>

            <p className="mt-3 leading-7 text-zinc-500">
              Enter a registration, VIN or chassis number and
              we'll identify the vehicle.
            </p>

          </div>


          {/* Step 2 */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

            <div className="text-sm font-medium text-blue-400">
              02
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              Tell us the price
            </h3>

            <p className="mt-3 leading-7 text-zinc-500">
              Enter what you're paying and choose whether you'd
              like us to estimate shipping.
            </p>

          </div>


          {/* Step 3 */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">

            <div className="text-sm font-medium text-blue-400">
              03
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              See the real cost
            </h3>

            <p className="mt-3 leading-7 text-zinc-500">
              Get a clear breakdown of taxes, shipping,
              registration and your estimated total landed cost.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================================
          COST SECTION
      ========================================================= */}

      <section
        id="costs"
        className="border-y border-white/10 bg-white/[0.015]"
      >

        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:px-12 md:py-32 lg:grid-cols-2 lg:items-center">


          {/* Text */}
          <div>

            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
              One number that matters
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Know what the car will really cost.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              Instead of guessing how much VRT, VAT, customs,
              shipping and registration will add, ImportX brings
              everything together in one clear calculation.
            </p>

          </div>


          {/* Cost card */}
          <div className="rounded-3xl border border-white/10 bg-[#111318] p-7 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-zinc-500">
                  Estimated landed cost
                </p>

                <p className="mt-2 text-5xl font-semibold tracking-tight">
                  €27,846
                </p>

              </div>

              <div className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
                Good deal
              </div>

            </div>


            <div className="my-7 h-px bg-white/10" />


            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Vehicle price
                </span>

                <span>
                  €21,800
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Shipping & transport
                </span>

                <span>
                  €1,250
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Customs & VAT
                </span>

                <span>
                  €2,100
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  VRT & NOx
                </span>

                <span>
                  €2,396
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Registration & fees
                </span>

                <span>
                  €300
                </span>
              </div>

            </div>


            <div className="my-7 h-px bg-white/10" />


            <div className="flex items-center justify-between">

              <span className="font-medium">
                Total
              </span>

              <span className="text-2xl font-semibold">
                €27,846
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          PRICING
      ========================================================= */}

      <section
        id="pricing"
        className="mx-auto max-w-7xl px-6 py-24 text-center md:px-12 md:py-32"
      >

        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
          Simple pricing
        </p>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Start free. Upgrade when you need more.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-400">
          The basic calculation will always be simple and
          accessible. Premium features can unlock deeper vehicle
          intelligence and advanced tools.
        </p>


        <div className="mx-auto mt-14 max-w-md rounded-3xl border border-blue-500/30 bg-[#111318] p-8 text-left shadow-2xl shadow-blue-500/5">

          <p className="text-lg font-semibold">
            Free
          </p>

          <p className="mt-3 text-4xl font-semibold">
            €0

            <span className="text-base font-normal text-zinc-500">
              {" "}
              to start
            </span>
          </p>


          <div className="mt-7 space-y-4 text-sm text-zinc-400">

            <p>
              ✓ Basic import calculation
            </p>

            <p>
              ✓ Vehicle information
            </p>

            <p>
              ✓ Cost breakdown
            </p>

            <p>
              ✓ Save calculations
            </p>

          </div>


          <button
            type="button"
            className="mt-8 w-full rounded-xl bg-blue-600 py-3.5 font-medium transition hover:bg-blue-500"
          >
            Start calculating
          </button>

        </div>

      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section
        id="guides"
        className="px-6 pb-24 md:px-12 md:pb-32"
      >

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-[#111318] to-[#08090b] px-8 py-16 text-center md:px-16 md:py-24">

          <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
            Your next car starts here
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Know the number before you buy.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Calculate the estimated cost of importing your next
            vehicle in minutes.
          </p>

          <button
            type="button"
            className="mt-8 rounded-xl bg-blue-600 px-8 py-4 font-medium transition hover:bg-blue-500"
          >
            Calculate my import cost →
          </button>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/10 px-6 py-10 md:px-12">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">

          <div className="text-lg font-bold text-white">
            Import<span className="text-blue-500">X</span>
          </div>

          <p>
            © 2026 ImportX. Import smarter.
          </p>

          <div className="flex gap-6">

            <a
              href="#"
              className="transition hover:text-white"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              Terms
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              Contact
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}