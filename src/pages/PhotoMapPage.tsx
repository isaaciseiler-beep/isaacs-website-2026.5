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
const MAP_BACKGROUND = "#f4f7fe";
const MAP_WATER = "#eceff4";
const MAP_LAND = "#dce4f1";
const MAP_PARK = "#d2dceb";
const MAP_COAST = "#aeb9ca";
const MAP_BORDER = "#8d98ab";
const MAP_DETAIL = "#bcc6d7";
const MAP_LABEL = "#4f5a69";
const DESKTOP_PANEL_WIDTH = 350;
const DESKTOP_PANEL_GUTTER = 16;
const MOBILE_PANEL_HEIGHT = 260;
const WORLD_SOURCE = "photo-map-world";
const WORLD_LAND_LAYER = "photo-map-world-land";
const WORLD_BORDER_LAYER = "photo-map-world-borders";
const WORLD_BORDER_DISPUTED_LAYER = "photo-map-world-borders-disputed";

type MarkerEntry = {
  marker: mapboxgl.Marker;
  element: HTMLButtonElement;
};

const stopMarkerEvent = (event: Event) => event.stopPropagation();

const defaultMapView = (isMobile: boolean) => ({
  ...photoMapInitialView,
  center: (isMobile ? [105, 18] : photoMapInitialView.center) as [number, number],
  zoom: isMobile ? 0.48 : photoMapInitialView.zoom,
});

const addWorldGeographyLayers = (map: mapboxgl.Map) => {
  try {
    if (!map.getSource(WORLD_SOURCE)) {
      map.addSource(WORLD_SOURCE, {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      });
    }

    if (!map.getLayer(WORLD_LAND_LAYER)) {
      map.addLayer({
        id: WORLD_LAND_LAYER,
        type: "fill",
        source: WORLD_SOURCE,
        "source-layer": "country_boundaries",
        paint: {
          "fill-color": MAP_LAND,
          "fill-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0.54, 1.2, 0.64, 4, 0.78],
        },
      });
    }

    if (!map.getLayer(WORLD_BORDER_LAYER)) {
      map.addLayer({
        id: WORLD_BORDER_LAYER,
        type: "line",
        source: WORLD_SOURCE,
        "source-layer": "country_boundaries",
        filter: ["!=", ["get", "disputed"], "true"],
        paint: {
          "line-color": MAP_BORDER,
          "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0.3, 1.2, 0.48, 3, 0.72, 6, 1.1],
          "line-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0.34, 1.2, 0.48, 4, 0.62],
          "line-blur": 0.28,
        },
      });
    }

    if (!map.getLayer(WORLD_BORDER_DISPUTED_LAYER)) {
      map.addLayer({
        id: WORLD_BORDER_DISPUTED_LAYER,
        type: "line",
        source: WORLD_SOURCE,
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "disputed"], "true"],
        paint: {
          "line-color": MAP_BORDER,
          "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0.2, 1.2, 0.36, 4, 0.62],
          "line-opacity": 0.22,
          "line-dasharray": [2, 1.2],
        },
      });
    }
  } catch {
    // The dedicated boundary tiles require a valid Mapbox token; the base map still works without them.
  }
};

const applyMapPalette = (map: mapboxgl.Map) => {
  const layers = map.getStyle().layers ?? [];

  layers.forEach((layer) => {
    const id = layer.id.toLowerCase();

    try {
      if (layer.type === "background") {
        map.setPaintProperty(layer.id, "background-color", MAP_BACKGROUND);
      }

      if (layer.type === "fill") {
        if (id.includes("water") || id.includes("background")) {
          map.setPaintProperty(layer.id, "fill-color", id.includes("water") ? MAP_WATER : MAP_BACKGROUND);
        } else if (id.includes("park") || id.includes("landuse")) {
          map.setPaintProperty(layer.id, "fill-color", MAP_PARK);
        } else if (id.includes("land") || id.includes("country") || id.includes("continent")) {
          map.setPaintProperty(layer.id, "fill-color", MAP_LAND);
        } else {
          map.setPaintProperty(layer.id, "fill-color", MAP_LAND);
          map.setPaintProperty(layer.id, "fill-opacity", 0.48);
        }
      }

      if (layer.type === "line" && /admin|boundary|border|coast|country|road|waterway|bridge|tunnel/.test(id)) {
        const isBorder = /admin|boundary|border|country/.test(id);
        const isCoast = id.includes("coast");
        map.setPaintProperty(layer.id, "line-color", isBorder ? MAP_BORDER : isCoast ? MAP_COAST : MAP_DETAIL);
        map.setPaintProperty(layer.id, "line-opacity", isBorder ? 0.08 : isCoast ? 0.26 : id.includes("road") ? 0.24 : 0.18);
      }

      if (layer.type === "symbol") {
        map.setPaintProperty(layer.id, "text-color", MAP_LABEL);
        map.setPaintProperty(layer.id, "text-halo-color", MAP_BACKGROUND);
        map.setPaintProperty(layer.id, "text-halo-width", 0.9);
      }
    } catch {
      // Mapbox base styles vary by layer; unsupported paint properties can be ignored.
    }
  });

  addWorldGeographyLayers(map);
};

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

  const selectedLocationOffset = () => {
    if (isMobile) return [0, -(MOBILE_PANEL_HEIGHT / 2)] as [number, number];

    return [-(DESKTOP_PANEL_WIDTH + DESKTOP_PANEL_GUTTER * 2) / 2, 0] as [number, number];
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    const initialView = defaultMapView(isMobile);
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MONOCHROME_MAP_STYLE,
      center: initialView.center,
      zoom: initialView.zoom,
      minZoom: 0.35,
      maxZoom: 12,
      pitch: initialView.pitch,
      bearing: initialView.bearing,
      projection: { name: "globe" },
      attributionControl: false,
      fadeDuration: 0,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    const handleLoad = () => {
      applyMapPalette(map);
      map.setFog({
        color: MAP_BACKGROUND,
        "high-color": MAP_BACKGROUND,
        "horizon-blend": 0,
        "space-color": MAP_BACKGROUND,
        "star-intensity": 0,
      });
      setMapReady(true);
    };
    const handleError = () => {
      setMapError("The map could not load. Check that the Mapbox token is available.");
    };

    map.on("load", handleLoad);
    map.on("style.load", () => applyMapPalette(map));
    map.on("error", handleError);
    map.on("click", () => setActiveEntryId(null));

    return () => {
      markerEntriesRef.current.forEach(({ marker }) => marker.remove());
      markerEntriesRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [isMobile, mapboxToken]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const map = mapRef.current;
    let frame = 0;
    let start = 0;
    const view = defaultMapView(isMobile);

    const resizeDuringTransition = (time: number) => {
      if (!start) start = time;
      map.resize();
      if (!activeEntry) {
        map.setCenter(view.center);
      }

      if (time - start < 460) {
        frame = window.requestAnimationFrame(resizeDuringTransition);
      }
    };

    frame = window.requestAnimationFrame(resizeDuringTransition);
    const settle = window.setTimeout(() => {
      map.resize();
      if (!activeEntry) {
        map.easeTo({
          center: view.center,
          zoom: view.zoom,
          pitch: view.pitch,
          bearing: view.bearing,
          duration: 220,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          essential: true,
        });
      }
    }, 470);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [activeEntry, isMobile, mapReady, sidebarOpen]);

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
        "photo-map-marker group absolute -left-4 -top-4 h-8 w-8 overflow-hidden rounded-full border border-[hsl(50_33%_7%/0.34)] bg-[#e2e8f4] shadow-[0_8px_22px_rgba(18,24,34,0.22)] grayscale transition-[transform,border-color,box-shadow,filter] duration-200 hover:scale-110 hover:border-[hsl(50_33%_7%/0.62)] hover:shadow-[0_12px_30px_rgba(18,24,34,0.3)] hover:grayscale-0 focus:outline-none focus:ring-2 focus:ring-[hsl(50_33%_7%/0.28)] sm:-left-[18px] sm:-top-[18px] sm:h-9 sm:w-9 sm:shadow-[0_9px_24px_rgba(18,24,34,0.24)]";
      button.setAttribute("aria-label", `Open ${entry.location} photos`);
      button.style.backgroundImage = `linear-gradient(rgba(244,247,254,0.02), rgba(0,0,0,0.18)), url("${entry.coverImage}")`;
      button.style.backgroundSize = "cover";
      button.style.backgroundPosition = "center";

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
          offset: selectedLocationOffset(),
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
      element.classList.toggle("grayscale-0", isActive);
      element.style.zIndex = isActive ? "5" : "1";
    });
  }, [activeEntryId]);

  const resetGlobe = () => {
    const view = defaultMapView(isMobile);
    mapRef.current?.flyTo({
      center: view.center,
      zoom: view.zoom,
      pitch: view.pitch,
      bearing: view.bearing,
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
    <div className="relative min-h-[100svh] overflow-hidden bg-[#f4f7fe] text-foreground">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onClose={() => setSidebarOpen(false)} showToggle={false} />

      <motion.main
        animate={{
          marginLeft: sidebarOpen && !isMobile ? 240 : 0,
          width: sidebarOpen && !isMobile ? "calc(100% - 240px)" : "100%",
        }}
        transition={{ duration: 0.4, ease: EASE_TEXT }}
        className="relative h-[100svh] overflow-hidden bg-[#f4f7fe]"
      >
        <section className="relative h-full overflow-hidden bg-[#f4f7fe]">
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

          <section className="pointer-events-none absolute inset-x-0 bottom-0 right-0 z-[70] flex justify-end p-3 sm:inset-y-0 sm:left-auto sm:w-[382px] sm:p-4">
            <AnimatePresence mode="wait">
              {activeEntry ? (
                <motion.article
                  key={activeEntry.id}
                  className="group/photo-panel pointer-events-auto relative flex h-[40svh] min-h-[260px] w-full overflow-hidden border border-white/18 bg-[hsl(50_33%_7%)] text-white shadow-2xl shadow-black/45 sm:h-full sm:max-w-[350px]"
                  initial={isMobile ? { opacity: 0, y: 28, filter: "blur(8px)" } : { opacity: 0, x: 36, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                  exit={isMobile ? { opacity: 0, y: 24, filter: "blur(6px)" } : { opacity: 0, x: 28, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <img
                    src={activeEntry.coverImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover/photo-panel:scale-[1.015] group-hover/photo-panel:grayscale-0"
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
