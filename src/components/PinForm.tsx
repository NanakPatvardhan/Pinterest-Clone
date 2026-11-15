type PinFormProps = {
    title: string;
    image: string;
    description: string;
    newPinCategory: string;
    setTitle: (value: string) => void;
    setImage: (value: string) => void;
    setDescription: (value: string) => void;
    setNewPinCategory: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditing: boolean;
    onCancel: () => void;

  };


export default function PinForm({
    title,
    image,
    description,
    newPinCategory,
    setTitle,
    setImage,
    setDescription,
    setNewPinCategory,
    onSubmit,
    isEditing,
    onCancel,

}: PinFormProps) {
    return (
        <form onSubmit={onSubmit}>


                <input
                type="text"
                placeholder="Pin title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />


<input
  type = "text"
  placeholder = "Image URL"
 value={image}
 onChange={(e) => setImage(e.target.value)}

  />

              <input
  type = "text"
  placeholder = "Description"
 value={description}
 onChange={(e) => setDescription(e.target.value)}

  />
  <select
value={newPinCategory}
onChange={(e) => setNewPinCategory(e.target.value)}

>
<option value="Travel">Travel</option>
<option value="Fitness">Fitness</option>
<option value="Coding">Coding</option>
<option value="Food">Food</option>


</select>
        <button type= "submit">
       {isEditing ? "Update Pin": "Add New Pin" }
      </button>{isEditing && (
  <button type="button" onClick={onCancel}>
    Cancel Edit
  </button>

)}

        </form>
    );
}