import { useEffect, useMemo, useState } from "react";

import { isWithinRadius, type Coordinates } from "@/features/home/utils";

const parseNumberEnv = (value: string | undefined, fallback: number) => {
  if (value == null || value.trim() === "") {
    return fallback;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const WORK_LOCATION: Coordinates = {
  latitude: parseNumberEnv(
    process.env.NEXT_PUBLIC_WORK_LOCATION_LATITUDE,
    37.5402096,
  ),
  longitude: parseNumberEnv(
    process.env.NEXT_PUBLIC_WORK_LOCATION_LONGITUDE,
    127.0736448,
  ),
};

const CLOCK_IN_RADIUS_METERS = parseNumberEnv(
  process.env.NEXT_PUBLIC_CLOCK_IN_RADIUS_METERS,
  50,
);

const CACHED_GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 10 * 60_000,
  timeout: 5_000,
};

const WATCH_GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 60_000,
  timeout: 60_000,
};

export default function useClockInLocation() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    const updateUserLocation = ({ coords }: GeolocationPosition) => {
      setUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    };

    const resetLocationOnPermissionDenied = (
      error: GeolocationPositionError,
    ) => {
      if (error.code === 1) {
        setUserLocation(null);
      }
    };

    navigator.geolocation.getCurrentPosition(
      updateUserLocation,
      resetLocationOnPermissionDenied,
      CACHED_GEOLOCATION_OPTIONS,
    );

    const watchId = navigator.geolocation.watchPosition(
      updateUserLocation,
      resetLocationOnPermissionDenied,
      WATCH_GEOLOCATION_OPTIONS,
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return useMemo(() => {
    const canClockInAtWorkLocation =
      userLocation != null &&
      isWithinRadius({
        center: WORK_LOCATION,
        target: userLocation,
        radiusMeters: CLOCK_IN_RADIUS_METERS,
      });

    return {
      canClockInAtWorkLocation,
    };
  }, [userLocation]);
}
