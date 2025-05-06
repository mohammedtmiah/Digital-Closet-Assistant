// Import necessary hooks and Firebase storage utilities
import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase"; // Your Firebase app config

// Initialize Firebase Storage
const storage = getStorage(app);

// The AddItemForm component allows users to input wardrobe items
function AddItemForm({ onAdd }) {
  // State variables for form fields and image upload
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [occasion, setOccasion] = useState("");
  const [season, setSeason] = useState("");
  const [image, setImage] = useState(null);
  const [dragOver, setDragOver] = useState(false); // for drag visual feedback
  const [uploading, setUploading] = useState(false); // shows "Uploading..." while file is being uploaded

  // Handles uploading image to Firebase Storage
  const handleImageUpload = async (file) => {
    if (!file) return;
    const storageRef = ref(storage, `images/${Date.now()}-${file.name}`); // Create unique storage ref
    setUploading(true);
    await uploadBytes(storageRef, file); // Upload file
    const url = await getDownloadURL(storageRef); // Get public URL of uploaded image
    setImage(url); // Save image URL to state
    setUploading(false);
  };

  // Handles when an image is dropped into the drag area
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0]; // Get dropped file
    handleImageUpload(file); // Upload it
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Make sure required fields are filled
    if (!name || !category || !color) return alert("Please fill in required fields.");

    // Send item data back to parent via onAdd callback
    onAdd({ name, category, color, occasion, season, image });

    // Clear form
    setName(""); setCategory(""); setColor(""); setOccasion(""); setSeason(""); setImage(null);
  };

  // The form UI
  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold mb-2">Add New Item</h2>

      {/* Name input */}
      <input
        type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required
        className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
      />

      {/* Category dropdown */}
      <select value={category} onChange={(e) => setCategory(e.target.value)} required
        className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600">
        <option value="">Select Category</option>
        {/* Category options */}
        {["Top","Shirt", "Hoodie", "Jacket", "Trousers", "Shoes", "Skirt", "Dress", "Accessories"].map(cat =>
          <option key={cat} value={cat}>{cat}</option>
        )}
      </select>

      {/* Color dropdown */}
      <select value={color} onChange={(e) => setColor(e.target.value)} required
        className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600">
        <option value="">Select Color</option>
        {/* Color options */}
        {["Black", "White", "Grey", "Red", "Blue", "Yellow", "Green", "Pink", "Purple", "Brown", "Beige", "Orange", "Navy"].map(col =>
          <option key={col} value={col}>{col}</option>
        )}
      </select>

      {/* Occasion dropdown (optional) */}
      <select value={occasion} onChange={(e) => setOccasion(e.target.value)}
        className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600">
        <option value="">Select Occasion</option>
        {["Casual", "Formal", "Work", "Party", "Sport", "Holiday", "Date", "Night-Out"].map(o =>
          <option key={o} value={o}>{o}</option>
        )}
      </select>

      {/* Season dropdown (optional) */}
      <select value={season} onChange={(e) => setSeason(e.target.value)}
        className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600">
        <option value="">Select Season</option>
        {["Spring", "Summer", "Autumn", "Winter"].map(s =>
          <option key={s} value={s}>{s}</option>
        )}
      </select>

      {/* Image upload area - drag & drop or click */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`w-full p-6 border-2 border-dashed text-center rounded ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 dark:border-gray-600"}`}
        onClick={() => document.getElementById("fileInput").click()} // Clicking opens file dialog
      >
        {/* Show different messages based on upload state */}
        {uploading ? "Uploading..." : image ? "✅ Image uploaded" : "Drag & drop an image or click to upload"}
        <input type="file" id="fileInput" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0])} />
      </div>

      {/* Submit button */}
      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">
        Add Item
      </button>
    </form>
  );
}

export default AddItemForm;
