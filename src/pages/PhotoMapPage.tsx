import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import mapboxgl, { type LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import { photoMapEntries, photoMapInitialView, type PhotoMapEntry } from "@/lib/photoMap";
import { useIsMobile } from "@/hooks/use-mobile";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const MONOCHROME_MAP_STYLE = "mapbox://styles/mapbox/light-v11";

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
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
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
      style: MONOCHROME_MAP_STYLE,
      center: photoMapInitialView.center,
      zoom: photoMapInitialView.zoom,
      minZoom: 1,
      maxZoom: 12,
      pitch: photoMapInitialView.pitch,
      bearing: photoMapInitialView.bearing,
      projection: { name: "globe" },
      attributionControl: false,
      fadeDuration: 0,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

    const handleLoad = () => {
      const siteBackground = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim();
      const backgroundColor = siteBackground ? `hsl(${siteBackground})` : "hsl(50 33% 7%)";

      map.setFog({
        color: backgroundColor,
        "high-color": backgroundColor,
        "horizon-blend": 0,
        "space-color": backgroundColor,
        "star-intensity": 0,
      });
      setMapReady(true);
    };
    const handleError = () => {
      setMapError("The map could not load. Check that the Mapbox token is available.");
    };

    map.on("load", handleLoad);
    map.on("error", handleError);
    map.on("click", () => setActiveEntryId(null));

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

  const albumHref = (entry: PhotoMapEntry) =>
    entry.albumFolder ? `/photos?album=${encodeURIComponent(entry.albumFolder)}` : "/photos";

  const hasAlbum = (entry: PhotoMapEntry) => Boolean(entry.albumFolder);

  const openEntry = (entry: PhotoMapEntry) => {
    if (!hasAlbum(entry)) return;

    navigate(albumHref(entry));
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
        className="relative h-[100svh] overflow-hidden bg-background"
      >
        <section className="relative h-full overflow-hidden bg-background">
          <div ref={containerRef} className="photo-map-shell h-full w-full" />

          {!mapReady || mapError ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/96 p-6">
              <div className="w-full max-w-xs text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-foreground/45">
                  {mapError ? "Map unavailable" : "Photo Map"}
                </p>
                <div className="mx-auto mt-4 h-px w-40 overflow-hidden bg-foreground/10">
                  {!mapError ? <div className="photo-map-loading-bar h-full w-1/2 bg-foreground/60" /> : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-foreground/60">
                  {mapError ?? "Loading locations"}
                </p>
              </div>
            </div>
          ) : null}

          <section className="pointer-events-none absolute inset-x-0 bottom-0 right-0 z-20 flex justify-end p-3 sm:inset-y-0 sm:left-auto sm:w-[430px] sm:p-4">
            <AnimatePresence mode="wait">
              {activeEntry ? (
                <motion.article
                  key={activeEntry.id}
                  className="pointer-events-auto relative flex h-[42svh] min-h-[280px] w-full overflow-hidden border border-white/15 bg-[hsl(50_33%_7%)] text-white shadow-2xl shadow-black/35 sm:h-full sm:max-w-[390px]"
                  initial={isMobile ? { opacity: 0, y: 28, filter: "blur(8px)" } : { opacity: 0, x: 36, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                  exit={isMobile ? { opacity: 0, y: 24, filter: "blur(6px)" } : { opacity: 0, x: 28, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <img
                    src={activeEntry.coverImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/22 to-black/20" />
                  <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end p-4 sm:p-5">
                    <button
                      type="button"
                      className="mb-4 text-left sm:mb-6"
                      onClick={() => openEntry(activeEntry)}
                      aria-label={hasAlbum(activeEntry) ? `Open ${activeEntry.location} album` : `${activeEntry.location} album not available`}
                    >
                      <h1 className="text-4xl font-semibold leading-[0.9] tracking-tight sm:text-5xl">{activeEntry.title}</h1>
                    </button>

                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      {hasAlbum(activeEntry) ? (
                        <Link
                          to={albumHref(activeEntry)}
                          className="photo-map-panel-button group"
                        >
                          <span className="relative z-10 flex items-center justify-between">
                            Open Album
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </span>
                        </Link>
                      ) : (
                        <div className="photo-map-panel-button photo-map-panel-button-disabled">
                          <span className="relative z-10">Album not available</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={resetGlobe}
                        className="photo-map-panel-button photo-map-panel-icon-button group"
                        aria-label="Reset map view"
                      >
                        <RotateCcw className="relative z-10 h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ) : null}
            </AnimatePresence>
          </section>
        </section>
      </motion.main>

      <SiteHeader open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  );
};

export default PhotoMapPage;
