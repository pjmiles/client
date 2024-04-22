import { useState, useCallback, memo } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  Marker,
} from "@react-google-maps/api";
import UserDetailModal from "./components/UserDetailModal";

const containerStyle = {
  width: "100vw",
  height: "85vh",
};

const apiKey = process.env.REACT_APP_API_KEY;

// long and lat of a default location
const defaultCenter = {
  lat: 6.605874,
  lng: 3.349149,
};

function App() {
  const [map, setMap] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${apiKey}`,
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(defaultCenter);
    map.setCenter(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(2); // Round to 2 decimal places
  };

  const handleMapClick = (e) => {
    // Extracting latlng from click event
    const latLng = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setLocations([...locations, latLng]);
    setSelectedLocation(latLng);
  };

  return (
    <div className="App">
      <header className="bg-blue-500 flex justify-between items-center mx-auto p-4">
        <h1 className="text-3xl text-center text-white font-bold">Pinned</h1>
        <button
          onClick={openModal}
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-400"
        >
          Send Details
        </button>
      </header>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          onClick={handleMapClick}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={location}
              title={`Distance: ${calculateDistance(
                defaultCenter.lat,
                defaultCenter.lng,
                location.lat,
                location.lng
              )} km`}
            />
          ))}
          <MarkerF title="Intial Point" position={defaultCenter}></MarkerF>
        </GoogleMap>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <p className="font-bold bg-gray-50 mt-[100px] text-red-500">
            Error Fetching Map. Please try again.
          </p>
        </div>
      )}
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        location={selectedLocation}
      />
    </div>
  );
}

export default memo(App);
