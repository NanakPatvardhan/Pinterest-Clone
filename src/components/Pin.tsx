import { Link } from "react-router-dom";

type PinProps = {
  id: number;
  title: string;
  image: string;
  description: string;
  category: string;
  onSave: (pinId: number) => void;
  onDelete?: (pinId: number) => void;
  onEdit?: (pinId: number) => void;
  isSaved: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
};

export default function Pin({
  id,
  title,
  image,
  description,
  category,
  onSave,
  onDelete,
  onEdit,
  isSaved,
  showEdit = true,
  showDelete = true,
}: PinProps) {
  return (
    <div className="pin">

      <div className="pin-image-container">

        <img src={image} alt={title} />

        <button
          className={`save-overlay ${isSaved ? "saved" : ""}`}
          onClick={() => onSave(id)}
        >
          {isSaved ? "Saved" : "Save"}
        </button>

      </div>

      <div className="pin-content">

        <Link to={`/pin/${id}`} className="pin-title-link">
          <h2>{title}</h2>
        </Link>

        <p>{description}</p>

        <span className="pin-category">
          {category}
        </span>

        <div className="pin-actions">

          {showEdit && onEdit && (
            <button onClick={() => onEdit(id)}>
              Edit
            </button>
          )}

          {showDelete && onDelete && (
            <button
              className="delete-button"
              onClick={() => onDelete(id)}
            >
              Delete
            </button>
          )}

        </div>

      </div>

    </div>
  );
}