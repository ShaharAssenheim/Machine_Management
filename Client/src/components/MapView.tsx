import React, { useMemo, useEffect, useRef, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { Machine } from "../types";
import MachinePopup from "./MachinePopup";
import { useTheme } from "../context/ThemeContext";
import {
  Globe2,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  X,
} from "lucide-react";

/* -------------------- Helpers -------------------- */

const getCountryColor = (country: string): string => {
  switch (country.toLowerCase()) {
    case "israel":
      return "#2563eb"; // blue
    case "japan":
      return "#e11d48"; // red
    case "germany":
      return "#f59e42"; // orange
    case "usa":
      return "#22c55e"; // green
    case "france":
      return "#a21caf"; // purple
    default:
      return "#a3a3a3"; // gray
  }
};

/* -------------------- Marker -------------------- */

const CustomMarker: React.FC<{
  machine: Machine;
  onClick: () => void;
}> = ({ machine, onClick }) => {
  const color = getCountryColor(machine.location.country);

  return (
    <Marker
      longitude={machine.location.longitude}
      latitude={machine.location.latitude}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <div className="relative w-6 h-6 cursor-pointer">
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            border: `2px solid ${color}`,
            boxShadow: `0 0 14px ${color}`,
            animationDuration: "2.2s",
          }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-white"
          style={{
            background: color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>
    </Marker>
  );
};

/* -------------------- Main Component -------------------- */

const MapView: React.FC<{ machines?: Machine[] }> = ({ machines: machinesProp = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const mapRef = useRef<any>(null);
  const hasCenteredRef = useRef(false);

  const [popupMachine, setPopupMachine] = useState<Machine | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  /* -------------------- Data -------------------- */

  const filteredMachines = useMemo(() => {
    return machinesProp.filter((m) => {
      const statusMatch = filterStatus === "all" || m.status === filterStatus;
      const searchMatch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.location.city.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [machinesProp, filterStatus, searchTerm]);

  /* -------------------- Initial Center (ONCE) -------------------- */

  const initialViewState = useMemo(() => {
    const validMachines = filteredMachines.filter(
      (m) => m.location.latitude !== 0 && m.location.longitude !== 0
    );
    
    if (!validMachines.length) {
      return { longitude: 0, latitude: 20, zoom: 1.6 };
    }
    
    // Calculate center point
    const sumLat = validMachines.reduce((sum, m) => sum + m.location.latitude, 0);
    const sumLng = validMachines.reduce((sum, m) => sum + m.location.longitude, 0);
    
    return {
      longitude: sumLng / validMachines.length,
      latitude: sumLat / validMachines.length,
      zoom: 1.6,
    };
  }, [filteredMachines]);

  /* -------------------- Map Controls -------------------- */

  const zoomIn = () => {
    const map = mapRef.current?.getMap();
    map?.zoomTo(map.getZoom() + 0.5, { duration: 400 });
  };

  const zoomOut = () => {
    const map = mapRef.current?.getMap();
    map?.zoomTo(map.getZoom() - 0.5, { duration: 400 });
  };

  const resetView = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.flyTo({
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      duration: 900,
    });
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="relative w-full h-[700px] min-h-[400px] bg-gray-200">
      {/* Map */}
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        /* 🔒 WORLD LOCK SETTINGS */
        renderWorldCopies={false}
        // Best standard bounds for a 16:9 or 4:3 container
        maxBounds={[
          [-179, -85], // Southwest coordinates [lng, lat]
          [179, 85], // Northeast coordinates [lng, lat]
        ]}
        // MinZoom is critical: if it's too high, you can't see the whole world.
        // If it's too low (0), the world looks like a tiny postage stamp.
        minZoom={0}
        maxZoom={11}
        // Prevent user from dragging the map out of view
        dragRotate={false}
        touchPitch={false}
        pitchWithRotate={false}
      >
        {filteredMachines.map((m, idx) =>
          m.location?.latitude && m.location?.longitude ? (
            <CustomMarker
              key={m.name + idx}
              machine={m}
              onClick={() => setPopupMachine(m)}
            />
          ) : null
        )}

        {popupMachine && (
          <Popup
            longitude={popupMachine.location.longitude}
            latitude={popupMachine.location.latitude}
            anchor="bottom"
            closeOnClick={false}
            onClose={() => setPopupMachine(null)}
          >
            <div className="p-2 min-w-[180px]">
              <p className="font-bold text-sm">{popupMachine.name}</p>
              <p className="text-xs text-gray-500">{popupMachine.location.city}</p>
              <button
                onClick={() => {
                  setSelectedMachine(popupMachine);
                  setShowDetails(true);
                }}
                className="mt-2 w-full text-xs bg-blue-600 text-white py-1.5 rounded-lg"
              >
                View Details
              </button>
            </div>
          </Popup>
        )}
      </Map>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.45))]" />

      {/* Controls */}
      <div className="absolute bottom-6 right-6 z-10 space-y-2">
        <button onClick={zoomIn} className="control-btn">
          <ZoomIn />
        </button>
        <button onClick={zoomOut} className="control-btn">
          <ZoomOut />
        </button>
        <button onClick={resetView} className="control-btn">
          <Maximize2 />
        </button>
      </div>

      {/* Details Modal */}
      {showDetails && selectedMachine && (
        <MachinePopup
          machine={selectedMachine}
          onClose={() => setShowDetails(false)}
          onViewDetails={() => console.log("navigate")}
        />
      )}
    </div>
  );
};

export default MapView;
