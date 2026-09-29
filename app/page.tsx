"use client";

import { useState } from "react";

const SERVICES = ["Personal Care", "Homemaking", "Respite"];

const labelClass = "w-48 pr-4 text-right text-[13px] font-bold text-[#3a8fc7]";
const inputClass =
  "border border-[#7f9db9] bg-[#dfe9f1] px-1 py-0.5 text-right text-sm text-black";

const TWO_DECIMALS = /^\d*\.?\d{0,2}$/;

export default function Home() {
  const [serviceDate, setServiceDate] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [hours, setHours] = useState("");
  const [totalCost, setTotalCost] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ serviceDate, service, hours, totalCost });
  }

  return (
    <main className="flex-1 bg-white px-10 py-6 text-black">
      <div className="mb-8 flex items-center gap-2">
        <h1 className="text-[15px] font-bold text-[#5a6b7b]">Claim details</h1>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2f7fc1] text-[11px] font-bold text-white">
          ?
        </span>
        <div className="h-px flex-1 bg-[#d0d7de]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center">
          <label htmlFor="serviceDate" className={labelClass}>
            Service date (YYYY-MM-DD)
          </label>
          <input
            id="serviceDate"
            type="date"
            required
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
            className="w-[94px] border border-black bg-[#dfe9f1] px-1 py-0.5 text-sm text-black"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="service" className={labelClass}>
            Service
          </label>
          <select
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="border border-[#7f9db9] bg-white px-1 py-0.5 text-sm text-black"
          >
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="hours" className={labelClass}>
            Number of hours
          </label>
          <input
            id="hours"
            type="text"
            inputMode="decimal"
            pattern="\d*\.?\d{1,2}"
            required
            value={hours}
            onChange={(e) => {
              if (TWO_DECIMALS.test(e.target.value)) setHours(e.target.value);
            }}
            className={`w-[68px] ${inputClass}`}
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="totalCost" className={labelClass}>
            Total cost ($)
          </label>
          <input
            id="totalCost"
            type="text"
            inputMode="decimal"
            pattern="\d*\.?\d{1,2}"
            required
            value={totalCost}
            onChange={(e) => {
              if (TWO_DECIMALS.test(e.target.value)) setTotalCost(e.target.value);
            }}
            className={`w-[68px] ${inputClass}`}
          />
        </div>

        <div className="mt-8 flex">
          <div className="w-48 pr-4" />
          <button
            type="submit"
            className="rounded-sm border border-[#1b5e9e] bg-gradient-to-b from-[#3d9be0] to-[#0a6fc2] px-3 py-0.5 text-[13px] font-bold text-white"
          >
            Add claim
          </button>
        </div>
      </form>
    </main>
  );
}
