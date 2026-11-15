import { useContext, useEffect , useState } from "react";
import "../styles.css";
import Pin from "./Pin";
import { PinContext } from "./PinContext";
import PinForm from "./PinForm";
import type { FormEvent } from "react";

export default function Home() {






const [title, setTitle] = useState("");
const [image, setImage] = useState("");
const [description, setDescription] = useState("");
const [search, setSearch] = useState("");
const cleanSearch = search.trim().toLowerCase();
const [selectedCategory, setSelectedCategory] = useState("All");
const [newPinCategory, setNewPinCategory] =useState("Travel");
const [showSavedOnly, setShowSavedOnly] = useState(false);


const context = useContext(PinContext);

if (!context) {
  throw new Error("Home must be inside PinProvider");

}
const { pins, savedPins, loading, error, handleSave, deletePin, updatePin: updatePinInContext , addPin: addPinInContext} = context;




const [editingPinId, setEditingPinId] = useState<number | null>(null);
const editingPin = pins.find((pin) => pin.id === editingPinId);




function addPin(e: FormEvent<HTMLFormElement>) {
e.preventDefault();


  const newPin = {
    id: Date.now(),
    title,
    image,
    description,
    category: newPinCategory,
  };

  addPinInContext(newPin);
  resetForm();



}
const filteredPins = pins.filter((pin) => {

  const matchesSearch =
pin.title.toLowerCase().includes(cleanSearch) ||
pin.description.toLowerCase().includes(cleanSearch);

const matchesCategory =
selectedCategory === "All" ||
pin.category === selectedCategory;


const matchesSaved = ! showSavedOnly || savedPins.includes(pin.id);

return matchesSearch && matchesCategory && matchesSaved;
});



function handleEdit(pinId: number) {
setEditingPinId(pinId);
}
useEffect(() => {
if (editingPin){
  setTitle(editingPin.title);
  setImage(editingPin.image);
  setDescription(editingPin.description);
  setNewPinCategory(editingPin.category);
}
}, [editingPin]);

function updatePin(e: FormEvent<HTMLFormElement>) {
e.preventDefault();
updatePinInContext(editingPinId!, {
  title,
  image,
  description,
  category: newPinCategory,
});
resetForm();
}


function resetForm() {
setTitle("");
setImage("");
setDescription("");
setNewPinCategory("Travel");
setEditingPinId(null);
};



return (
    <div className="App">




      <h1>Pinterest Clone</h1>

      <p>Saved Pins: {savedPins.length}</p>


      <button onClick={() => setShowSavedOnly(!showSavedOnly)}>
  {showSavedOnly ? "Show All Pins" : "Show Saved Pins"}
  </button>






  <PinForm
  title={title}
  image={image}
  description={description}
  newPinCategory={newPinCategory}
  setTitle={setTitle}
  setImage={setImage}
  setDescription={setDescription}
  setNewPinCategory={setNewPinCategory}
  onSubmit={editingPinId !== null ? updatePin : addPin}
  isEditing={editingPinId !== null}
  onCancel={resetForm}
/>











{/* SEARCH BAR */}

<div className="search-section">

  <input
    type="text"
    placeholder="Search your inspiration..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-input"
  />

  {search && (
    <button onClick={() => setSearch("")}>
      Clear
    </button>
  )}

</div>


{/* CATEGORY FILTERS */}

<div className="category-filters">

  {["All", "Travel", "Fitness", "Coding", "Food"].map((category) => (

    <button
      key={category}
      className={selectedCategory === category ? "active-category" : ""}
      onClick={() => setSelectedCategory(category)}
    >
      {category}
    </button>

  ))}

</div>

{loading ? (
  <p>Loading pins...</p>
) : error ? (
  <p>{error}</p>
) : filteredPins.length === 0 ? (
  <p>No Pins found.</p>
)
:
(
  <div className="pin-grid">
    {filteredPins.map((pin) => (
      <Pin
        key={pin.id}
        id={pin.id}
        title={pin.title}
        image={pin.image}
        description={pin.description}
        category={pin.category}
        onSave={handleSave}
        onDelete={deletePin}
        onEdit={handleEdit}
        isSaved={savedPins.includes(pin.id)}

      />
    ))}
  </div>
)}
    </div>
  );


}