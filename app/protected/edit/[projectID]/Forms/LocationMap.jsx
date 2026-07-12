"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

// Centro de Costa Rica, usado solo como punto de partida cuando el
// proyecto todavía no tiene una ubicación guardada en google_url.
const DEFAULT_CENTER = { lat: 9.7489, lng: -83.7534 };

// google_url se guarda como "https://www.google.com/maps?q=lat,lng" (ver
// updateLocation más abajo); esta función lo interpreta de vuelta para
// centrar el mapa en la ubicación ya guardada al abrir el proyecto.
function parseGoogleUrl(url) {
  if (!url) return null;

  const match = url.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (!match) return null;

  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

export default function LocationMap({ locationForm, setLocationForm }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Si el script de Google Maps ya se había cargado antes (ej. el usuario
  // cambió de tab y volvió), se detecta con este inicializador en vez de
  // depender solo del onLoad de <Script>, que no vuelve a dispararse.
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.google?.maps),
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const updateLocation = useCallback(
    (lat, lng) => {
      setLocationForm((prev) => ({
        ...prev,
        google_url: `https://www.google.com/maps?q=${lat},${lng}`,
      }));
    },
    [setLocationForm],
  );

  useEffect(() => {
    if (!scriptReady || !mapDivRef.current || mapRef.current) return;

    const initialPosition =
      parseGoogleUrl(locationForm.google_url) || DEFAULT_CENTER;
    const hasSavedLocation = Boolean(parseGoogleUrl(locationForm.google_url));

    const map = new window.google.maps.Map(mapDivRef.current, {
      center: initialPosition,
      zoom: hasSavedLocation ? 16 : 8,
    });

    const marker = new window.google.maps.Marker({
      position: initialPosition,
      map,
      draggable: true,
    });

    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      updateLocation(position.lat(), position.lng());
    });

    map.addListener("click", (e) => {
      marker.setPosition(e.latLng);
      updateLocation(e.latLng.lat(), e.latLng.lng());
    });

    mapRef.current = map;
    markerRef.current = marker;
    // Solo debe inicializar el mapa una vez que el script está listo; no
    // debe reinicializarse si locationForm cambia por otros medios.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady, updateLocation]);

  if (!apiKey) {
    return (
      <div className="alert alert-warning">
        Falta configurar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en el .env del
        frontend para activar el mapa.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <p className="text-sm opacity-70">
        Da clic en el mapa o arrastra el marcador para marcar la ubicación
        exacta del proyecto. Se guarda junto con el resto de la información
        al presionar Guardar.
      </p>

      <div
        ref={mapDivRef}
        className="w-full h-96 rounded-box border border-base-300"
      ></div>

      {locationForm.google_url && (
        <a
          href={locationForm.google_url}
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary text-sm"
        >
          Ver ubicación guardada en Google Maps
        </a>
      )}
    </div>
  );
}
