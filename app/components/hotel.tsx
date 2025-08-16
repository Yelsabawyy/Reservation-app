"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
// Zod schema
const hotelSchema = z.object({
  destination: z.string().min(2, "Destination is required"),
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.number().min(1, "At least 1 guest required"),
  rooms: z.number().min(1, "At least 1 room required"),
});

type HotelForm = z.infer<typeof hotelSchema>;

export default function HotelReservation() {
  const [mapCenter, setMapCenter] = useState<[number, number]>([30.0444, 31.2357]); // Default Cairo

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HotelForm>({
    resolver: zodResolver(hotelSchema),
  });

  function onSubmit(data: HotelForm) {
    alert(
      `🏨 Hotel Reservation Confirmed!\n\nDestination: ${data.destination}\nCheck-in: ${format(
        data.checkIn,
        "PPP"
      )}\nCheck-out: ${format(data.checkOut, "PPP")}\nGuests: ${data.guests}\nRooms: ${data.rooms}`
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Big Map */}

      {/* Form */}
      <div className="w-full max-w-2xl rounded-2xl p-6  bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Destination */}
          <div className="col-span-2 space-y-2">
            <Label className="font-medium">Destination*</Label>
            <Input
              className="rounded-2xl"
              placeholder="Where are you going?"
              {...register("destination")}
            />
            {errors.destination && (
              <p className="text-red-500 text-sm">{errors.destination.message}</p>
            )}
          </div>

          {/* Check-in */}
          <div className="space-y-2 col-span-2  md:col-span-1">
            <Label className="font-medium">Check-in*</Label>
            <Input type="date" className="rounded-2xl" {...register("checkIn", { valueAsDate: true })} />
            {errors.checkIn && <p className="text-red-500 text-sm">{errors.checkIn.message}</p>}
          </div>

          {/* Check-out */}
          <div className="space-y-2 col-span-2  md:col-span-1">
            <Label className="font-medium">Check-out*</Label>
            <Input type="date" className="rounded-2xl" {...register("checkOut", { valueAsDate: true })} />
            {errors.checkOut && <p className="text-red-500 text-sm">{errors.checkOut.message}</p>}
          </div>

          {/* Guests */}
          <div className="space-y-2 col-span-2  md:col-span-1">
            <Label className="font-medium">Guests*</Label>
            <Input
              type="number"
              className="rounded-2xl"
              placeholder="e.g. 2"
              {...register("guests", { valueAsNumber: true })}
            />
            {errors.guests && <p className="text-red-500 text-sm">{errors.guests.message}</p>}
          </div>

          {/* Rooms */}
          <div className="space-y-2 col-span-2  md:col-span-1">
            <Label className="font-medium">Rooms*</Label>
            <Input
              type="number"
              className="rounded-2xl"
              placeholder="e.g. 1"
              {...register("rooms", { valueAsNumber: true })}
            />
            {errors.rooms && <p className="text-red-500 text-sm">{errors.rooms.message}</p>}
          </div>

          {/* Submit */}
          <div className="col-span-2 space-y-2 mt-4">
            <Button className="w-full bg-black text-white rounded-2xl" type="submit">
              Reserve
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
