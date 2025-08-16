"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/**
 * Small Cinema Reservation - Full component
 *
 * Features:
 * - Small curved responsive seat map (5 rows)
 * - Booked seats example (disabled)
 * - Seat selection integrated with react-hook-form
 * - Form fields: name, email, phone, date, time
 * - 30-minute time slots (10:00 - 23:00)
 * - Zod validation
 * - Total price calculation and confirmation alert with code
 *
 * Usage: place this component in a page or component tree.
 */

/* ---------------- Config ---------------- */

const SMALL_LAYOUT = [
  { row: "A", count: 6, curvePad: "1rem", seatSize: "w-7 h-7", section: "VIP", aisleAfter: [3] },
  { row: "B", count: 7, curvePad: "0.75rem", seatSize: "w-7 h-7", section: "VIP", aisleAfter: [4] },
  { row: "C", count: 8, curvePad: "0.5rem", seatSize: "w-7 h-7", section: "Standard", aisleAfter: [4] },
  { row: "D", count: 8, curvePad: "0.5rem", seatSize: "w-7 h-7", section: "Standard", aisleAfter: [4] },
  { row: "E", count: 6, curvePad: "1rem", seatSize: "w-7 h-7", section: "Economy", aisleAfter: [3] },
] as const;

const BOOKED = new Set<string>(["A2", "B4", "C5", "D6", "E3"]); // example; replace with API data
const PRICES = { VIP: 15, Standard: 12, Economy: 8 } as const;
type Section = keyof typeof PRICES;

/* ---------------- Utilities ---------------- */

function buildSlots(startHour = 10, endHour = 23) {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    for (const m of [0, 30]) {
      if (h === endHour && m === 30) continue;
      slots.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
    }
  }
  return slots;
}

/* ---------------- Validation ---------------- */

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^01[0-9]{9}$/, "Phone must be a valid Egyptian number (11 digits starting with 01)"),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  seats: z.array(z.string()).min(1, "Select at least one seat"),
});

type FormValues = z.infer<typeof schema>;

/* ---------------- Component ---------------- */

export default function SmallCinemaReservation() {
  const slots = useMemo(() => buildSlots(10, 23), []);
  const { register, handleSubmit, setValue, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", date: "", time: "", seats: [] },
  });

  const { errors } = formState;
  const selectedSeats = watch("seats") || [];

  // seat toggle integrated with react-hook-form
  function toggleSeat(seatId: string) {
    const set = new Set(selectedSeats);
    if (set.has(seatId)) set.delete(seatId);
    else set.add(seatId);
    setValue("seats", Array.from(set), { shouldValidate: true, shouldDirty: true });
  }

  function seatColor(section: Section, selected: boolean, booked: boolean) {
    if (booked) return "bg-gray-400 text-gray-700 cursor-not-allowed";
    if (selected) return "bg-green-600 text-white";
    if (section === "VIP") return "bg-amber-200 hover:bg-amber-300";
    if (section === "Standard") return "bg-blue-200 hover:bg-blue-300";
    return "bg-purple-200 hover:bg-purple-300";
  }

  const total = (selectedSeats || []).reduce((sum: number, seatId: string) => {
    const row = seatId[0];
    const cfg = SMALL_LAYOUT.find((r) => r.row === row);
    if (!cfg) return sum;
    return sum + PRICES[cfg.section as Section];
  }, 0);

  function onSubmit(data: FormValues) {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    // Show summary (you can replace with modal or API call)
    alert(
      `🎟 Reservation Confirmed!\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nDate: ${data.date}\nTime: ${data.time}\nSeats: ${data.seats.join(
        ", "
      )}\nTotal: $${total}\n\nCode: ${code}\n\nPlease show this code at check-in.`
    );
    // optionally clear form or redirect
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Small Cinema — Reserve Seats</h2>

      {/* Screen */}
      <div className="w-full mb-6 flex flex-col items-center">
        <div className="w-3/4 h-2 rounded-full bg-gray-400" aria-hidden />
        <span className="text-xs text-gray-500 mt-1">SCREEN</span>
      </div>

      {/* Seat Map */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
        <div className="space-y-2">
          {SMALL_LAYOUT.map((r) => (
            <div
              key={r.row}
              className="flex items-center justify-center gap-1 sm:gap-2"
              style={{ paddingLeft: r.curvePad, paddingRight: r.curvePad }}
            >
              {/* row label left (small screens hide) */}
              <div className="hidden sm:flex w-5 text-xs text-gray-500">{r.row}</div>

              <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                {Array.from({ length: r.count }).map((_, idx) => {
                  const number = idx + 1;
                  const seatId = `${r.row}${number}`;
                  const isBooked = BOOKED.has(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  const needsAisle = r.aisleAfter?.includes(number);

                  return (
                    <div key={seatId} className="flex items-center">
                      <button
                        type="button"
                        aria-label={`Seat ${seatId} - ${r.section}`}
                        disabled={isBooked}
                        onClick={() => toggleSeat(seatId)}
                        className={[
                          "rounded-md font-medium flex items-center justify-center transition text-[10px] sm:text-xs",
                          r.seatSize,
                          seatColor(r.section as Section, isSelected, isBooked),
                        ].join(" ")}
                      >
                        {number}
                      </button>
                      {needsAisle && <div className="w-2 sm:w-3" aria-hidden />}
                    </div>
                  );
                })}
              </div>

              <div className="hidden sm:flex w-5 text-xs text-gray-500">{r.row}</div>
            </div>
          ))}
        </div>

        {/* Legend + Selected/Total */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <Legend className="bg-amber-200" label={`VIP ($${PRICES.VIP})`} />
          <Legend className="bg-blue-200" label={`Standard ($${PRICES.Standard})`} />
          <Legend className="bg-purple-200" label={`Economy ($${PRICES.Economy})`} />
          <Legend className="bg-green-600 text-white" label="Selected" />
          <Legend className="bg-gray-400" label="Booked" />
          <div className="ml-auto text-gray-700 text-sm">
            Selected: <span className="font-medium">{selectedSeats.length}</span> • Total:{" "}
            <span className="font-semibold">${total}</span>
          </div>
        </div>
      </div>

      {/* Reservation Form */}
      <form className="bg-white p-4 rounded-lg shadow-sm space-y-3" onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name*</label>
          <input
            className={`mt-1 block w-full rounded-2xl border px-3 py-2 text-sm ${
              errors.name ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="e.g., Ahmed Youssef"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email*</label>
          <input
            className={`mt-1 block w-full rounded-2xl border px-3 py-2 text-sm ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="john@example.com"
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone*</label>
          <input
            className={`mt-1 block w-full rounded-2xl border px-3 py-2 text-sm ${
              errors.phone ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="01xxxxxxxxx"
            {...register("phone")}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date*</label>
            <input
              type="date"
              className={`mt-1 block w-full rounded-2xl border px-3 py-2 text-sm ${
                errors.date ? "border-red-500" : "border-gray-200"
              }`}
              {...register("date")}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Time*</label>
            <select
              className={`mt-1 block w-full rounded-2xl border px-3 py-2 text-sm ${
                errors.time ? "border-red-500" : "border-gray-200"
              }`}
              {...register("time")}
            >
              <option value="">Select time</option>
              {slots.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
          </div>
        </div>

        {/* Hidden seats field is already in form via setValue in toggleSeat */}

        {/* Seat validation message */}
        {errors.seats && <p className="text-red-500 text-xs">{errors.seats.message as string}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-black text-white rounded-2xl py-2 text-sm font-medium hover:opacity-95"
          >
            Confirm Reservation
          </button>
          <button
            type="button"
            onClick={() => {
              // quick clear: reset seats + basic fields (doesn't reset validation)
              setValue("seats", []);
              setValue("name", "");
              setValue("email", "");
              setValue("phone", "");
              setValue("date", "");
              setValue("time", "");
            }}
            className="flex-1 border rounded-2xl py-2 text-sm font-medium"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Legend helper ---------------- */

function Legend({ className, label }: { className?: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <span className={`inline-block w-4 h-4 rounded ${className ?? "bg-gray-300"}`} />
      <span className="text-gray-700">{label}</span>
    </div>
  );
}
