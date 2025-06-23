"use client";
import React from "react";
import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { setDefaults, fromAddress, OutputFormat } from "react-geocode";
import Spinner from "./Spinner";
import Image from "next/image";
import pin from "@/assets/images/pin.svg";

const PropertyMap = ({ property }: any) => {
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });
  const [loading, setLoading] = useState(true);
  const [geocodingError, setGeocodingError] = useState(false);
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
    language: "en",
    region: "us",
    outputFormat: OutputFormat.XML,
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fromAddress(
          `${property.location.street} ${property.location.city}, ${property.location.state} ${property.zip}`
        );

        if (response.status === "ZERO_RESULTS") {
          setGeocodingError(true);
          setLoading(false);
          return;
        }

        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });

        setLoading(false);
      } catch (error) {
        // Handle any errors that occur during geocoding
        console.error("Geocoding error:", error);
        setGeocodingError(true);
        setLoading(false);
      }
    };
    fetchCoordinates();
  }, []);
  if (loading) return <Spinner loading={loading} />;
  if (geocodingError) {
    return <div className="text-red-500">No location data available.</div>;
  }
  return (
    !loading && (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        initialViewState={{
          longitude: lng ?? 0,
          latitude: lat ?? 0,
          zoom: 15,
        }}
        style={{ width: "100%", height: 400 }}
      >
        <Marker longitude={lng ?? 0} latitude={lat ?? 0} anchor="bottom">
          <Image
            src={pin}
            alt="location"
            width={40}
            height={40}
            priority={true}
          />{" "}
        </Marker>
      </Map>
    )
  );
};

export default PropertyMap;
