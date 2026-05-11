import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Images, MapPin, X } from "lucide-react";
import mapboxgl, { type LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import PhotoPreview from "@/components/PhotoPreview";
import { photoMapEntries, photoMapInitialView, type PhotoMapEntry } from "@/lib/photoMap";
import { useIsMobile } from "@/hooks/use-mobile";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type MarkerEntry = {
  marker: mapboxgl.Marker;
  element: HTMLButtonElement;
};

const stopMarkerEvent = (event: Event) => event.stopPropagation();

const PhotoMapPage = () => {
  const mapboxToken =
    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ??
    import.meta.env.VITE_MAPBOX_TOKEN ??
    "";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerEntriesRef = useRef<Map<string, MarkerEntry>>(new Map());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const activeEntry = useMemo(
    () => photoMapEntries.find((entry) => entry.id === activeEntryId) ?? null,
    [activeEntryId],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: photoMapInitialView.center,
      zoom: photoMapInitialView.zoom,
      minZoom: 1,
      maxZoom: 12,
      pitch: photoMapInitialView.pitch,
      bearing: photoMapInitialView.bearing,
      projection: { name: "globe" },
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

    const handleLoad = () => {
      map.setFog({
        color: "rgb(18, 22, 24)",
        "high-color": "rgb(130, 166, 190)",
        "horizon-blend": 0.18,
        "space-color": "rgb(4, 5, 6)",
        "star-intensity": 0.12,
      });
      setMapReady(true);
    };
    const handleError = () => {
      setMapError("The map could not load. Check that the Mapbox token is available.");
    };

    map.on("load", handleLoad);
    map.on("error", handleError);

    return () => {
      markerEntriesRef.current.forEach(({ marker }) => marker.remove());
      markerEntriesRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const map = mapRef.current;
    const entries = markerEntriesRef.current;

    photoMapEntries.forEach((entry) => {
      if (entries.has(entry.id)) return;

      const root = document.createElement("div");
      root.className = "relative h-0 w-0";

      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "photo-map-marker group absolute -left-5 -top-5 h-10 w-10 overflow-hidden rounded-full border border-white/80 bg-neutral-950 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition duration-200 hover:scale-110 hover:border-white focus:outline-none focus:ring-2 focus:ring-white/80";
      button.setAttribute("aria-label", `Open ${entry.location} photos`);
      button.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.28)), url("${entry.coverImage}")`;
      button.style.backgroundSize = "cover";
      button.style.backgroundPosition = "center";

      const pulse = document.createElement("span");
      pulse.className = "absolute inset-[-6px] rounded-full border border-white/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100";
      button.appendChild(pulse);

      button.addEventListener("pointerdown", stopMarkerEvent);
      button.addEventListener("mousedown", stopMarkerEvent);
      button.addEventListener("touchstart", stopMarkerEvent, { passive: true });
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setActiveEntryId(entry.id);
        setPreviewIdx(null);
        map.flyTo({
          center: entry.coordinates as LngLatLike,
          zoom: Math.max(map.getZoom(), 3.25),
          speed: 0.65,
          curve: 1.35,
          essential: true,
        });
      });

      root.appendChild(button);
      const marker = new mapboxgl.Marker({ element: root, anchor: "center", clickTolerance: 8 })
        .setLngLat(entry.coordinates)
        .addTo(map);
      entries.set(entry.id, { marker, element: button });
    });
  }, [mapReady]);

  useEffect(() => {
    markerEntriesRef.current.forEach(({ element }, id) => {
      const isActive = id === activeEntryId;
      element.classList.toggle("scale-125", isActive);
      element.classList.toggle("border-[hsl(var(--highlight))]", isActive);
      element.classList.toggle("ring-2", isActive);
      element.classList.toggle("ring-[hsl(var(--highlight))]/60", isActive);
      element.style.zIndex = isActive ? "5" : "1";
    });
  }, [activeEntryId]);

  const resetGlobe = () => {
    mapRef.current?.flyTo({
      center: photoMapInitialView.center,
      zoom: photoMapInitialView.zoom,
      pitch: photoMapInitialView.pitch,
      bearing: photoMapInitialView.bearing,
      speed: 0.55,
      curve: 1.2,
      essential: true,
    });
  };

  if (!mapboxToken) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-background px-6 text-foreground">
        <div className="max-w-sm text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/40">Photo Map</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Mapbox token missing</h1>
          <p className="mt-3 text-sm leading-6 text-foreground/60">
            Add `VITE_MAPBOX_ACCESS_TOKEN` or `VITE_MAPBOX_TOKEN` to enable the globe.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onClose={() => setSidebarOpen(false)} showToggle={false} />

      <motion.main
        animate={{
          marginLeft: sidebarOpen && !isMobile ? 240 : 0,
          width: sidebarOpen && !isMobile ? "calc(100% - 240px)" : "100%",
        }}
        transition={{ duration: 0.4, ease: EASE_TEXT }}
        className="relative h-[100svh] overflow-hidden"
      >
        <div ref={containerRef} className="photo-map-shell h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(0,0,0,0.05)_45%,rgba(0,0,0,0.58)_100%)]" />

        {!mapReady || mapError ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <div className="border border-white/15 bg-neutral-950/70 px-5 py-4 text-center text-white shadow-2xl backdrop-blur-xl">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/45">
                {mapError ? "Map unavailable" : "Loading globe"}
              </p>
              <p className="mt-2 text-sm text-white/70">{mapError ?? "Preparing the photo map."}</p>
            </div>
          </div>
        ) : null}

        <section className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 sm:bottom-4 sm:left-auto sm:right-4 sm:w-[390px] sm:p-0">
          <AnimatePresence mode="wait">
            {activeEntry ? (
              <motion.article
                key={activeEntry.id}
                className="pointer-events-auto overflow-hidden border border-white/15 bg-[hsl(50_33%_7%/0.86)] text-white shadow-2xl shadow-black/35 backdrop-blur-2xl"
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <div className="grid grid-cols-[116px_1fr] gap-0">
                  <button
                    type="button"
                    className="relative aspect-square overflow-hidden bg-white/5"
                    onClick={() => setPreviewIdx(0)}
                    aria-label={`Open ${activeEntry.location} photo preview`}
                  >
                    <img src={activeEntry.coverImage} alt="" className="h-full w-full object-cover grayscale transition duration-500 hover:grayscale-0" />
                  </button>
                  <div className="min-w-0 p-4">
                    <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/42">
                      <MapPin className="h-3 w-3" />
                      {activeEntry.kind}
                    </div>
                    <h1 className="text-2xl font-semibold leading-none tracking-tight">{activeEntry.title}</h1>
                    <div className="mt-3 flex items-center gap-2 text-sm text-white/60">
                      <Images className="h-4 w-4" />
                      <span>{activeEntry.images.length} photos ready for coordinates</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                  <button
                    type="button"
                    onClick={resetGlobe}
                    className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45 transition hover:text-white"
                  >
                    Full globe
                  </button>
                  <Link
                    to="/photos"
                    className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45 transition hover:text-white"
                  >
                    Portfolio
                  </Link>
                </div>
              </motion.article>
            ) : null}
          </AnimatePresence>
        </section>

        <button
          type="button"
          onClick={() => setActiveEntryId(null)}
          aria-label="Clear selected photo location"
          className="absolute right-4 top-4 z-20 hidden h-9 w-9 items-center justify-center border border-white/15 bg-black/35 text-white/70 backdrop-blur-xl transition hover:text-white sm:flex"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.main>

      <PhotoPreview
        images={activeEntry?.images ?? []}
        currentIndex={previewIdx}
        onClose={() => setPreviewIdx(null)}
        onNavigate={setPreviewIdx}
      />

      <SiteHeader open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  );
};

export default PhotoMapPage;
