import { useState } from "react";

function useGeolocation(callback = () => {}) {
  const [error, setError] = useState(null);
  const [position, setPosition] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  function getPosition() {
    callback();

    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    );
  }

  return {getPosition, position, isLoading, error};
}

export default function App() {
  const [countClicks, setCountClicks] = useState(0);
  const {getPosition, position, isLoading, error} = useGeolocation(
    () => setCountClicks((count) => count + 1)
  );

  const { lat, lng } = position;

  return (
    <div>
      <button onClick={getPosition} disabled={isLoading}>
        Get my position
      </button>

      {isLoading && <p>Loading position...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && lat && lng && (
        <p>
          Your GPS position:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
          >
            {lat}, {lng}
          </a>
        </p>
      )}

      <p>You requested position {countClicks} times</p>
    </div>
  );
}
