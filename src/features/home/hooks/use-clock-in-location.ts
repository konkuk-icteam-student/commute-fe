import { useEffect, useMemo, useState } from "react";

import {
  getDistanceInMeters,
  isWithinRadius,
  type Coordinates,
} from "@/features/home/utils";

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

const geolocationErrorMessage: Record<number, string> = {
  1: "위치 권한이 거부되었습니다. 브라우저/OS 위치 권한을 허용해야 합니다.",
  2: "현재 위치를 확인할 수 없습니다. 기기의 위치 서비스 상태를 확인해주세요.",
  3: "위치 확인 시간이 초과되었습니다. 실내/PC 환경에서는 위치 수신이 늦거나 실패할 수 있습니다.",
};

export default function useClockInLocation() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.info("[clock-in] 위치 API를 사용할 수 없습니다.");
      return;
    }

    const updateUserLocation = ({ coords }: GeolocationPosition) => {
      console.info("[clock-in] 사용자 위치 수신", {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracyMeters: coords.accuracy,
      });

      setUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setLocationAccuracy(coords.accuracy);
    };

    const logLocationError = (error: GeolocationPositionError) => {
      console.info("[clock-in] 사용자 위치 수신 실패", {
        code: error.code,
        message: error.message,
        reason:
          geolocationErrorMessage[error.code] ??
          "알 수 없는 위치 오류가 발생했습니다.",
      });

      if (error.code === 1) {
        setUserLocation(null);
        setLocationAccuracy(null);
      }
    };

    navigator.geolocation.getCurrentPosition(
      updateUserLocation,
      logLocationError,
      CACHED_GEOLOCATION_OPTIONS,
    );

    const watchId = navigator.geolocation.watchPosition(
      updateUserLocation,
      logLocationError,
      WATCH_GEOLOCATION_OPTIONS,
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return useMemo(() => {
    const distanceFromWorkMeters =
      userLocation == null
        ? null
        : getDistanceInMeters(WORK_LOCATION, userLocation);
    const canClockInAtWorkLocation =
      userLocation != null &&
      isWithinRadius({
        center: WORK_LOCATION,
        target: userLocation,
        radiusMeters: CLOCK_IN_RADIUS_METERS,
      });

    return {
      allowedRadiusMeters: CLOCK_IN_RADIUS_METERS,
      canClockInAtWorkLocation,
      distanceFromWorkMeters,
      locationAccuracy,
      userLocation,
      workLocation: WORK_LOCATION,
    };
  }, [locationAccuracy, userLocation]);
}
