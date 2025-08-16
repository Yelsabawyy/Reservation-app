"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Build 30-min slots (12pm – 11pm typical restaurant hours)
function buildSlots(startHour = 12, endHour = 23) {
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
const restaurantSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, "Phone must be a valid Egyptian number"),
  guests: z
    .number()
    .min(1, "At least 1 guest required")
    .max(20, "Maximum 20 guests allowed"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
});

type RestaurantForm = z.infer<typeof restaurantSchema>;

export default function RestaurantReservation() {
  const [slots] = useState(buildSlots());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RestaurantForm>({
    resolver: zodResolver(restaurantSchema),
  });

  const time = watch("time");

  function onSubmit(data: RestaurantForm) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    alert(
      `🍽️ Restaurant Reservation Confirmed!\n\nName: ${data.name}\nGuests: ${
        data.guests
      }\nDate: ${format(new Date(data.date), "PPP")}\nTime: ${
        data.time
      }\n\nYour Code: ${code}`
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-lg">
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
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
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

          {/* Guests */}
          <div className="space-y-2">
            <Label className="font-medium">Number of Guests*</Label>
            <Input
              type="number"
              className="rounded-2xl"
              placeholder="2"
              {...register("guests", { valueAsNumber: true })}
            />
            {errors.guests && (
              <p className="text-red-500 text-sm">{errors.guests.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="font-medium">Date*</Label>
            <Input type="date" className="rounded-2xl" {...register("date")} />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label className="font-medium">Time*</Label>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  className={`rounded-2xl cursor-pointer ${
                    time === slot && "text-white bg-[#b91c1c]"
                  }`}
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

          {/* Notes */}
          <div className="space-y-2">
            <Label className="font-medium">Special Requests (Optional)</Label>
            <textarea
              className="rounded-2xl border w-full py-1 px-2"
              placeholder="e.g. Window seat, birthday cake..."
              {...register("notes")}
            ></textarea>
          </div>

          {/* Confirm */}
          <Button
            className="w-full mt-4 bg-red-600 text-white rounded-2xl"
            type="submit"
          >
            Confirm Reservation
          </Button>
        </form>
      </div>
    </div>
  );
}
