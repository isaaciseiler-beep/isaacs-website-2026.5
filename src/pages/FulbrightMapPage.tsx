"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

import AddPinForm, {
  type AddPinFormValues,
} from "@/components/fulbrightmap/AddPinForm";
import MapView from "@/components/fulbrightmap/MapView";
import SetupScreen from "@/components/fulbrightmap/SetupScreen";
import Toast, { type ToastMessage } from "@/components/fulbrightmap/Toast";
import TopPanel from "@/components/fulbrightmap/TopPanel";
import { getMapboxToken } from "@/lib/mapboxToken";
import {
  createPin,
  deletePin,
  getPins,
  getStorageMode,
  subscribeToPinChanges,
  uploadImage,
} from "@/lib/fulbrightmap/storage";
import type { PendingLocation, Pin } from "@/lib/fulbrightmap/types";
import { getAnonymousUserId } from "@/lib/fulbrightmap/user";

const MAP_LOCKED = true;

function sortPinsNewestFirst(pins: Pin[]) {
  return [...pins].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function mergePin(pins: Pin[], pin: Pin) {
  const existingIndex = pins.findIndex((candidate) => candidate.id === pin.id);
  if (existingIndex === -1) return sortPinsNewestFirst([pin, ...pins]);

  const nextPins = [...pins];
  nextPins[existingIndex] = pin;
  return sortPinsNewestFirst(nextPins);
}

export default function FulbrightMapPage() {
  const mapboxToken = getMapboxToken();
  const [anonymousUserId, setAnonymousUserId] = useState("");
  const [pins, setPins] = useState<Pin[]>([]);
  const [pendingLocation, setPendingLocation] = useState<PendingLocation | null>(
    null,
  );
  const [popupRequest, setPopupRequest] = useState<{
    pinId: string;
    fly: boolean;
    nonce: number;
  } | null>(null);
  const [highlightedPinId, setHighlightedPinId] = useState<string | null>(null);
  const [loadingPins, setLoadingPins] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastIdRef = useRef(0);
  const popupRequestNonceRef = useRef(0);

  const storageMode = getStorageMode();

  const showToast = useCallback(
    (message: Omit<ToastMessage, "id">) => {
      const id = toastIdRef.current + 1;
      toastIdRef.current = id;
      setToast({ id, ...message });
      window.setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, 4200);
    },
    [setToast],
  );

  useEffect(() => {
    const userId = getAnonymousUserId();
    setAnonymousUserId(userId);

    let active = true;
    async function loadPins(showError: boolean) {
      try {
        const nextPins = await getPins();
        if (!active) return;
        setPins(nextPins);
      } catch (error) {
        if (!active || !showError) return;
        showToast({
          tone: "error",
          title: "Could not load spots",
          detail: error instanceof Error ? error.message : "Please try again.",
        });
      } finally {
        if (active) setLoadingPins(false);
      }
    }

    void loadPins(true);

    const unsubscribeFromPinChanges =
      storageMode === "supabase"
        ? subscribeToPinChanges({
            onInsert: (pin) => {
              if (!active) return;
              setPins((current) => mergePin(current, pin));
            },
            onDelete: (pinId) => {
              if (!active) return;
              setPins((current) =>
                current.filter((candidate) => candidate.id !== pinId),
              );
              setPopupRequest((current) =>
                current?.pinId === pinId ? null : current,
              );
              setHighlightedPinId((current) =>
                current === pinId ? null : current,
              );
            },
            onError: (message) => {
              if (!active) return;
              showToast({
                tone: "warning",
                title: "Live updates paused",
                detail: message,
              });
            },
          })
        : null;

    const refreshInterval =
      storageMode === "supabase"
        ? window.setInterval(() => {
            void loadPins(false);
          }, 15000)
        : null;

    return () => {
      active = false;
      unsubscribeFromPinChanges?.();
      if (refreshInterval) window.clearInterval(refreshInterval);
    };
  }, [showToast, storageMode]);

  const handleMapClick = useCallback(
    (location: PendingLocation) => {
      if (MAP_LOCKED) return;
      setPendingLocation(location);
    },
    [],
  );

  async function handleSubmit(values: AddPinFormValues) {
    if (!pendingLocation || !values.image) return;

    setSubmitting(true);

    try {
      const imageUrl = await uploadImage(values.image, anonymousUserId);
      const pin = await createPin({
        ...pendingLocation,
        authorName: values.authorName,
        placeName: values.placeName,
        caption: values.caption,
        imageUrl,
        anonymousUserId,
      });

      setPins((current) => mergePin(current, pin));
      setPendingLocation(null);
      popupRequestNonceRef.current += 1;
      setPopupRequest({
        pinId: pin.id,
        fly: false,
        nonce: popupRequestNonceRef.current,
      });
      setHighlightedPinId(pin.id);
      window.setTimeout(() => setHighlightedPinId(null), 1800);
      showToast({
        tone: "success",
        title: "Spot added",
        detail:
          storageMode === "local"
            ? "Saved in this browser for local demo mode."
            : "Shared on the map.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Could not add this spot",
        detail: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeletePin(pinId: string) {
    if (MAP_LOCKED) return;

    const pin = pins.find((candidate) => candidate.id === pinId);
    if (!pin) return;

    try {
      await deletePin(pinId, anonymousUserId);
      setPins((current) => current.filter((candidate) => candidate.id !== pinId));
      setPopupRequest((current) =>
        current?.pinId === pinId ? null : current,
      );
      setHighlightedPinId((current) => (current === pinId ? null : current));
      showToast({
        tone: "success",
        title: "Spot deleted",
        detail: `${pin.placeName} was removed from the map.`,
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Could not delete this spot",
        detail: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  function chooseRandomSpot() {
    if (pins.length === 0) {
      showToast({
        tone: "info",
        title: "No spots yet",
        detail: "Add the first favorite place whenever you're ready.",
      });
      return;
    }

    const pin = pins[Math.floor(Math.random() * pins.length)];
    popupRequestNonceRef.current += 1;
    setPopupRequest({
      pinId: pin.id,
      fly: true,
      nonce: popupRequestNonceRef.current,
    });
    setHighlightedPinId(pin.id);
    window.setTimeout(() => setHighlightedPinId(null), 1800);
  }

  if (!mapboxToken) return <SetupScreen />;

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-neutral-950">
      <MapView
        token={mapboxToken}
        pins={pins}
        popupRequest={popupRequest}
        highlightedPinId={highlightedPinId}
        loadingPins={loadingPins}
        anonymousUserId={anonymousUserId}
        locked={MAP_LOCKED}
        onMapClick={handleMapClick}
        onDeletePin={handleDeletePin}
      />

      <TopPanel
        totalPins={pins.length}
        storageMode={storageMode}
        loading={loadingPins}
        locked={MAP_LOCKED}
        onRandomSpot={chooseRandomSpot}
      />

      {pendingLocation ? (
        <AddPinForm
          location={pendingLocation}
          submitting={submitting}
          onDismiss={() => setPendingLocation(null)}
          onSubmit={handleSubmit}
        />
      ) : null}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}
