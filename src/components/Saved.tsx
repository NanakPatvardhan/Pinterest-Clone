import { useContext } from "react";
import { Link } from "react-router-dom";
import { PinContext } from "./PinContext";
import Pin from "./Pin";
import "../styles.css";

export default function Saved() {
  const context = useContext(PinContext);

  if (!context) {
    throw new Error("Saved must be inside PinProvider");
  }

  const { pins, savedPins, handleSave, loading, error } = context;

  const savedPinList = pins.filter((pin) =>
    savedPins.includes(pin.id)
  );

  return (
    <div className="App saved-page">

      <div className="saved-header">
        <h1>Your Saved Collection</h1>
        <p>
          {savedPinList.length} saved {savedPinList.length === 1 ? "pin" : "pins"}
        </p>
      </div>

      {loading ? (
        <p>Loading saved pins...</p>
      ) : error ? (
        <p>{error}</p>
      ) : savedPinList.length === 0 ? (

        <div className="empty-saved">

          <h2>Nothing saved yet!</h2>

          <p>
            Discover something inspiring and save it to your collection.
          </p>

          <Link to="/" className="explore-button">
            Explore Pins
          </Link>

        </div>

      ) : (

        <div className="pin-grid">

          {savedPinList.map((pin) => (
            <Pin
              key={pin.id}
              id={pin.id}
              title={pin.title}
              image={pin.image}
              description={pin.description}
              category={pin.category}
              onSave={handleSave}
              isSaved={true}
              showEdit={false}
              showDelete={false}
            />
          ))}

        </div>

      )}

    </div>
  );
}