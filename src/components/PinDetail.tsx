import { useParams } from "react-router-dom";
import { useContext } from "react";
import { PinContext } from "./PinContext";


export default function PinDetail() {
  const {id} = useParams();
  const context = useContext(PinContext);
  if (!context) {
    throw new Error("PinDetails must be inside PinProvider");

  }
  const {pins, loading, error} = context;
  const pin = pins.find((pin) => pin.id === Number(id));

  if (loading) {
    return <p>Loading Pins...</p>
  }

  if (error) {
    return <p>{error}</p>;
  }
  if (!pin) {
    return <h1>Pin not found</h1>
  }

  return (
  <div className="pin-detail-page">

    <div className="pin-detail-card">

      <img
        src={pin.image}
        alt={pin.title}
        className="pin-detail-image"
      />

      <div className="pin-detail-content">

        <span className="pin-category">
          {pin.category}
        </span>

        <h1>{pin.title}</h1>

        <p>{pin.description}</p>

        <button onClick={() => window.history.back()}>
          ← Go Back
        </button>

      </div>

    </div>

  </div>
); }