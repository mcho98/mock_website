"use client";

import { useRef, useState } from "react";

const SERVICES = ["Personal care", "Homemaking", "Respite"];
const CHOOSE_ONE = "";
const DEFAULT_HOURS = "0";

const labelClass = "w-40 pr-4 text-right text-[13px] font-bold text-[#3a8fc7]";
const inputClass =
  "border border-[#7f9db9] bg-[#dfe9f1] px-1 py-0.5 text-right text-sm text-black";

const buttonClass =
  "rounded-sm border border-[#1b5e9e] bg-gradient-to-b from-[#3d9be0] to-[#0a6fc2] px-6 py-0.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50";

const TWO_DECIMALS = /^\d*\.?\d{0,2}$/;
const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

// Simulated server verification delay: a few milliseconds up to 3 seconds.
const MIN_DELAY_MS = 5;
const MAX_DELAY_MS = 3000;

type Claim = {
  id: number;
  serviceDate: string;
  service: string;
  hours: string;
  totalCost: string;
};

// Sum in whole cents to avoid floating-point drift; non-numeric entries count as 0.
function sumCents(values: string[]) {
  return values.reduce((sum, v) => sum + (Math.round(parseFloat(v) * 100) || 0), 0);
}

function ClaimsTable({
  claims,
  onModify,
  onRemove,
}: {
  claims: Claim[];
  onModify?: (c: Claim) => void;
  onRemove?: (c: Claim) => void;
}) {
  const totalCost = (sumCents(claims.map((c) => c.totalCost)) / 100).toFixed(2);
  const linkClass = "text-[#1a6fb5] underline disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="border border-[#b9d3e8] p-1">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#5bb6e8] text-left text-[13px] font-bold text-white">
            <th className="px-2 py-1 align-bottom">
              Service date
              <br />
              (YYYY-MM-DD)
            </th>
            <th className="px-2 py-1 align-bottom">Service</th>
            <th className="px-2 py-1 text-right align-bottom">
              Number of
              <br />
              hours
            </th>
            <th className="px-2 py-1 text-right align-bottom">Total cost ($)</th>
            <th className="w-20" />
            <th className="w-20" />
          </tr>
        </thead>
        <tbody>
          {claims.map((c) => (
            <tr key={c.id} className="border-b border-[#9aa5ae]">
              <td className="px-2 py-1">{c.serviceDate}</td>
              <td className="px-2 py-1">{c.service}</td>
              <td className="px-2 py-1 text-right">{c.hours}</td>
              <td className="px-2 py-1 text-right">{c.totalCost}</td>
              <td className="px-2 py-1 text-center">
                {onModify && (
                  <button type="button" className={linkClass} onClick={() => onModify(c)}>
                    Modify
                  </button>
                )}
              </td>
              <td className="px-2 py-1 text-center">
                {onRemove && (
                  <button type="button" className={linkClass} onClick={() => onRemove(c)}>
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
          <tr className="border-b-2 border-[#9aa5ae]">
            <td colSpan={3} />
            <td className="px-2 py-1 text-right font-bold">${totalCost}</td>
            <td colSpan={2} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <h1 className="text-[15px] font-bold text-[#5a6b7b]">{children}</h1>
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2f7fc1] text-[11px] font-bold text-white">
        ?
      </span>
      <div className="h-px flex-1 bg-[#d0d7de]" />
    </div>
  );
}

export default function Home() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [predetermined, setPredetermined] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [serviceDate, setServiceDate] = useState("");
  const [service, setService] = useState(CHOOSE_ONE);
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [totalCost, setTotalCost] = useState("");
  const nextId = useRef(1);
  const pickerRef = useRef<HTMLInputElement>(null);

  const locked = predetermined || verifying;

  function resetForm() {
    setServiceDate("");
    setService(CHOOSE_ONE);
    setHours(DEFAULT_HOURS);
    setTotalCost("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (locked) return;
    const claim: Claim = { id: nextId.current++, serviceDate, service, hours, totalCost };
    const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
    setVerifying(true);
    setTimeout(() => {
      setClaims((prev) => [...prev, claim]);
      resetForm();
      setVerifying(false);
    }, delay);
  }

  function handleModify(c: Claim) {
    setClaims((prev) => prev.filter((x) => x.id !== c.id));
    setServiceDate(c.serviceDate);
    setService(c.service);
    setHours(c.hours);
    setTotalCost(c.totalCost);
  }

  function handleRemove(c: Claim) {
    setClaims((prev) => prev.filter((x) => x.id !== c.id));
  }

  const rowActions = predetermined || verifying ? {} : { onModify: handleModify, onRemove: handleRemove };

  return (
    <main className="flex-1 bg-white px-10 py-6 text-black">
      <h1 className="mb-4 text-[17px] font-bold text-[#e07b22]">Enter details</h1>
      <div className="mb-8 w-[440px] border border-[#c5d0d9]">
        <div className="border-b border-[#c5d0d9] bg-[#dbe5ea] px-2 py-1 text-[13px] font-bold text-[#3b4a57]">
          Patient information
        </div>
        <dl className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-2 px-2 py-3 text-[13px]">
          <dt className="text-right font-bold text-[#3a8fc7]">Name</dt>
          <dd>John Doe</dd>
          <dt className="text-right font-bold text-[#3a8fc7]">ID number</dt>
          <dd>111</dd>
          <dt className="text-right font-bold text-[#3a8fc7]">Group number</dt>
          <dd>222</dd>
        </dl>
      </div>

      <SectionHeading>Claim type</SectionHeading>
      <div className="mx-auto mt-5 mb-10 flex w-[520px] items-center">
        <span className={labelClass}>Provider of service</span>
        <span className="bg-[#dfe9f1] px-2 py-0.5 text-[13px]">Home Care Services</span>
      </div>

      <SectionHeading>Claim details</SectionHeading>

      <form onSubmit={handleSubmit} className="mx-auto mt-6 flex w-[520px] flex-col gap-3">
        <div className="flex items-center">
          <label htmlFor="serviceDate" className={labelClass}>
            Service date (YYYY-MM-DD)
          </label>
          <input
            id="serviceDate"
            type="text"
            required
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            maxLength={10}
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
            className="w-[88px] border border-black bg-[#dfe9f1] px-1 py-0.5 text-sm text-black"
          />
          <button
            type="button"
            aria-label="Open calendar"
            onClick={() => pickerRef.current?.showPicker?.()}
            className="ml-2 flex h-5 w-5 items-center justify-center text-base leading-none"
          >
            📅
          </button>
          <input
            ref={pickerRef}
            type="date"
            tabIndex={-1}
            aria-hidden="true"
            value={DATE_FORMAT.test(serviceDate) ? serviceDate : ""}
            onChange={(e) => setServiceDate(e.target.value)}
            className="pointer-events-none h-0 w-0 opacity-0"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="service" className={labelClass}>
            Service
          </label>
          <select
            id="service"
            required
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="border border-[#7f9db9] bg-white px-1 py-0.5 text-sm text-black"
          >
            <option value={CHOOSE_ONE}>- Choose one -</option>
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
            className={`w-[62px] ${inputClass}`}
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
            className={`w-[62px] ${inputClass}`}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <button type="submit" disabled={locked} className={buttonClass}>
            {verifying ? "Verifying…" : "Add claim"}
          </button>
        </div>
      </form>

      {claims.length > 0 && (
        <div className="mt-10">
          <ClaimsTable claims={claims} {...rowActions} />
        </div>
      )}

      <div className="mt-10 flex justify-center gap-5">
        <button type="button" onClick={resetForm} disabled={verifying} className={buttonClass}>
          Cancel
        </button>
        <button
          type="button"
          disabled={verifying}
          onClick={() => {
            setPredetermined(true);
            setShowPopup(true);
          }}
          className={buttonClass}
        >
          Predetermine
        </button>
      </div>

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
