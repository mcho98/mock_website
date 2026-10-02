"use client";

import { useState } from "react";

const SERVICES = ["Personal Care", "Homemaking", "Respite"];

const labelClass = "w-48 pr-4 text-right text-[13px] font-bold text-[#3a8fc7]";
const inputClass =
  "border border-[#7f9db9] bg-[#dfe9f1] px-1 py-0.5 text-right text-sm text-black";

const buttonClass =
  "rounded-sm border border-[#1b5e9e] bg-gradient-to-b from-[#3d9be0] to-[#0a6fc2] px-3 py-0.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50";

const TWO_DECIMALS = /^\d*\.?\d{0,2}$/;

type Claim = {
  id: number;
  serviceDate: string;
  service: string;
  hours: string;
  totalCost: string;
};

function ClaimsTable({ claims }: { claims: Claim[] }) {
  return (
    <table className="border-collapse text-sm">
      <thead>
        <tr className="bg-[#dfe9f1] text-left text-[13px] text-[#3a8fc7]">
          <th className="border border-[#7f9db9] px-3 py-1">Service date</th>
          <th className="border border-[#7f9db9] px-3 py-1">Service</th>
          <th className="border border-[#7f9db9] px-3 py-1 text-right">Hours</th>
          <th className="border border-[#7f9db9] px-3 py-1 text-right">Total cost ($)</th>
        </tr>
      </thead>
      <tbody>
        {claims.map((c) => (
          <tr key={c.id}>
            <td className="border border-[#7f9db9] px-3 py-1">{c.serviceDate}</td>
            <td className="border border-[#7f9db9] px-3 py-1">{c.service}</td>
            <td className="border border-[#7f9db9] px-3 py-1 text-right">{c.hours}</td>
            <td className="border border-[#7f9db9] px-3 py-1 text-right">{c.totalCost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Home() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [predetermined, setPredetermined] = useState(false);
  const [serviceDate, setServiceDate] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [hours, setHours] = useState("");
  const [totalCost, setTotalCost] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (predetermined) return;
    setClaims((prev) => [
      ...prev,
      { id: prev.length + 1, serviceDate, service, hours, totalCost },
    ]);
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
            required
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            className={`w-[68px] ${inputClass}`}
          />
        </div>

        <div className="mt-8 flex">
          <div className="w-48 pr-4" />
          <button type="submit" disabled={predetermined} className={buttonClass}>
            Add claim
          </button>
        </div>

        <div className="flex">
          <div className="w-48 pr-4" />
          <button
            type="button"
            onClick={() => {
              setPredetermined(true);
              setShowPopup(true);
            }}
            className={buttonClass}
          >
            Predetermine Claim
          </button>
        </div>
      </form>

      {claims.length > 0 && <ClaimsTable claims={claims} />}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Added claims"
            className="max-h-[80vh] overflow-auto bg-white p-6 shadow-lg"
          >
            <h2 className="mb-4 text-[15px] font-bold text-[#5a6b7b]">Added claims</h2>
            {claims.length > 0 ? (
              <ClaimsTable claims={claims} />
            ) : (
              <p className="text-sm">No claims added.</p>
            )}
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className={`mt-6 ${buttonClass}`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
