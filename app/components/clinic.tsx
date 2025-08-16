"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// 30-min slots
function buildSlots(startHour = 9, endHour = 17) {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    for (const m of [0, 30]) {
      if (h === endHour && m === 30) continue;
      slots.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
    }
  }
  return slots;
}

// Zod schema
const reservationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email().min(1, "Email is required"),
  phone: z
    .string()
    .regex(
      /^01[0-9]{9}$/,
      "Phone must be a valid Egyptian number (11 digits starting with 01)"
    ),
  clinic: z.string().min(1, "Clinic is required"),
  date: z.date(),
  time: z.string().min(1, "Please select a time"),
});

type ReservationForm = z.infer<typeof reservationSchema>;

export default function ClinicReservation() {
  const [slots] = useState(buildSlots());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
  });

  const time = watch("time");

  function onSubmit(data: ReservationForm) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    alert(
      `✅ Reservation Confirmed!\n\nName: ${data.name}\nPhone: ${
        data.phone
      }\nClinic: ${data.clinic}\nDate: ${format(data.date, "PPP")}\nTime: ${
        data.time
      }\n\nYour Code: ${code}`
    );
  }

  return (
    <div className=" w-full  flex items-center justify-center">
      <div className="w-full max-w-lg border-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="font-medium">Full Name*</Label>
            <Input
              className="rounded-2xl"
              placeholder="Enter your full name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="font-medium">Email*</Label>
            <Input
              className="rounded-2xl"
              placeholder="john@example.com"
              {...register("email")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="font-medium">Phone*</Label>
            <Input
              className="rounded-2xl"
              type="tel"
              placeholder="01xxxxxxxxx"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="font-medium">Date*</Label>
            <Input
              className="rounded-2xl"
              type="date"
              {...register("date")}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            <Label className="font-medium">Time*</Label>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  className={`rounded-2xl cursor-pointer ${time === slot && 'text-white bg-[#007828]'}`}
                  variant={time === slot ? "default" : "outline"}
                  onClick={() => setValue("time", slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
            {errors.time && (
              <p className="text-red-500 text-sm">{errors.time.message}</p>
            )}
          </div>

          {/* Confirm Button */}
          <Button className="w-full mt-4 bg-black text-white rounded-2xl" type="submit">
            Confirm Reservation
          </Button>
        </form>
      </div>
    </div>
  );
}
