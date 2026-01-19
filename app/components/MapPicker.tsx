"use client";

import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function MapPicker({ onSelect }: any) {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState(center);
  const [autoComplete, setAutoComplete] = useState<any>(null);

  const onPlaceChanged = () => {
    const place = autoComplete.getPlace();
    if (!place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    let city = "";
    let state = "";

    place.address_components.forEach((comp: any) => {
      if (comp.types.includes("locality")) city = comp.long_name;
      if (comp.types.includes("administrative_area_level_1"))
        state = comp.long_name;
    });

    setMarker({ lat, lng });
    map.panTo({ lat, lng });

    onSelect({
      fullAddress: place.formatted_address,
      city,
      state,
      lat,
      lng,
    });
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
      libraries={["places"]}
    >
      <Autocomplete onLoad={setAutoComplete} onPlaceChanged={onPlaceChanged}>
        <input
          className="input mb-2"
          placeholder="Search location on map"
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker}
        zoom={14}
        onLoad={setMap}
      >
        <Marker position={marker} />
      </GoogleMap>
    </LoadScript>
  );
}
