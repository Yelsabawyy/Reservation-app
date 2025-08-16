"use client";
import { reservationOptions, ReservationType } from "@/types/reservation";
import { useState } from "react";
import ClinicReservation from "./components/clinic";
import RestaurantReservation from "./components/restaurant";
import HotelReservation from "./components/hotel";
import CinemaReservation from "./components/cinema";

export default function Home() {
  const [reservation, setReservation] = useState<ReservationType>("Clinic");
  return (
    <div className="w-full  p-10 bg-gray-50 space-y-4">
      <div className="font-semibold text-sm text-gray-500 flex flex-row justify-center">
        Reservation App
      </div>
      <div className="font-bold text-3xl md:text-5xl text-black flex flex-row justify-center">
        Book Your Appointment
      </div>
      <div className="font-medium text-sm text-gray-500 flex flex-row justify-center">
        Reserve your time now — you’ll receive a code to confirm your booking.
        Please show it at check-in to verify your reservation{" "}
      </div>
      <div className="flex flex-row justify-center space-x-3">
        {reservationOptions.map((res) => {
          return (
            <div
              onClick={() => {
                setReservation(res);
              }}
              className={`${res==reservation ?'text-white bg-[#007828]':'bg-black text-white' }   rounded-2xl  px-5 py-2 flex flex-row justify-center text-xs cursor-pointer`}
            >
              {res}
            </div>
          );
        })}
      </div>
      <div className="w-full flex flex-row justify-center">
      <div className="px-5 md:px-10 lg:px-15 py-5 max-w-3xl w-3xl">
        {reservation === "Clinic" && (
          <div className=" p-10 bg-white rounded-2xl space-y-4">
            <ClinicReservation/>
          </div>
        )}
        {reservation === "Restaurant" && (
          <div className=" p-10 bg-white rounded-2xl space-y-4">
            <RestaurantReservation/>
          </div>
        )}
        {reservation === "Hotel" && (
          <div className=" p-10 bg-white rounded-2xl space-y-4">
            <HotelReservation/>
          </div>
        )}
        {reservation === "Cinema" && (
          <div className=" p-10 bg-white rounded-2xl space-y-4">
            <CinemaReservation/>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
