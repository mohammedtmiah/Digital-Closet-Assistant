// Import React hooks and components
import { useState, useEffect, useRef } from "react";
import AddItemForm from "./AddItemForm";
import Chatbot from "./Chatbot";

function App() {
  // -------------------- STATE SETUP --------------------
  const [items, setItems] = useState([]); // All wardrobe items
  const [favorites, setFavorites] = useState([]); // (Unused in this version)
  const [favoriteOutfits, setFavoriteOutfits] = useState([]); // Saved AI-generated outfits
  const [searchTerm, setSearchTerm] = useState(""); // Text search input
  const [filterColor, setFilterColor] = useState(""); // Color filter
  const [filterOccasion, setFilterOccasion] = useState(""); // Occasion filter
  const [filterSeason, setFilterSeason] = useState(""); // Season filter
  const [suggestedOutfit, setSuggestedOutfit] = useState([]); // Outfit suggested by AI or algorithm
  const [selectedItems, setSelectedItems] = useState([]); // Indices of selected wardrobe items for custom outfit
  const [customOutfits, setCustomOutfits] = useState([]); // Saved manual (custom) outfits
  const hasLoaded = useRef(false); // Used to prevent localStorage save on initial load
  const [darkMode, setDarkMode] = useState(false); // Dark mode toggle

 // -------------------- LOAD FROM LOCAL STORAGE ON START --------------------
  useEffect(() => {
    const savedItems = localStorage.getItem("wardrobeItems");
    const savedFavorites = localStorage.getItem("wardrobeFavorites");
    const savedOutfits = localStorage.getItem("favoriteOutfits");
    const savedCustomOutfits = localStorage.getItem("customOutfits");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedOutfits) setFavoriteOutfits(JSON.parse(savedOutfits));
    if (savedCustomOutfits) setCustomOutfits(JSON.parse(savedCustomOutfits));
    if (savedDarkMode) {
      const dark = JSON.parse(savedDarkMode);
      setDarkMode(dark);
      document.documentElement.classList.toggle("dark", dark); // Apply dark class to <html>
    }

    hasLoaded.current = true;
  }, []);

  // -------------------- SAVE TO LOCAL STORAGE ON CHANGE --------------------
  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem("wardrobeItems", JSON.stringify(items));
      localStorage.setItem("wardrobeFavorites", JSON.stringify(favorites));
      localStorage.setItem("favoriteOutfits", JSON.stringify(favoriteOutfits));
      localStorage.setItem("customOutfits", JSON.stringify(customOutfits));
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }
  }, [items, favorites, favoriteOutfits, customOutfits, darkMode]);

  // -------------------- HELPER FUNCTIONS --------------------
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  const handleAddItem = (item) => setItems([...items, item]);
  const handleDeleteItem = (index) => setItems(items.filter((_, i) => i !== index));
  const handleRemoveFavorite = (index) => setFavorites(favorites.filter((_, i) => i !== index));
  const handleRemoveFavoriteOutfit = (index) =>
    setFavoriteOutfits(favoriteOutfits.filter((_, i) => i !== index));

   // Suggest a random outfit based on selected filters
  const handleSuggestOutfit = () => {
    const filtered = items.filter(
      (item) =>
        (!filterColor || item.color?.toLowerCase() === filterColor.toLowerCase()) &&
        (!filterOccasion || item.occasion?.toLowerCase() === filterOccasion.toLowerCase()) &&
        (!filterSeason || item.season?.toLowerCase() === filterSeason.toLowerCase())
    );

    const categories = ["hoodie", "shirt", "jacket", "trousers", "shoes"];
    const outfit = [];

    for (let cat of categories) {
      const matches = filtered.filter((item) => item.category?.toLowerCase() === cat);
      if (matches.length > 0) {
        const randomIndex = Math.floor(Math.random() * matches.length);
        outfit.push(matches[randomIndex]);
      }
    }

    if (outfit.length === 0) {
      alert("No matching items found!");
    }

    setSuggestedOutfit(outfit);
  };

  // Save current suggested outfit to favorites
  const handleAddFavoriteOutfit = () => {
    if (!suggestedOutfit.length) return;
    setFavoriteOutfits([...favoriteOutfits, suggestedOutfit]);
  };

  // Select/deselect items for manual outfit creation
  const toggleSelectItem = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Save a manually selected group of items as a custom outfit
  const handleCreateCustomOutfit = () => {
    if (selectedItems.length < 2) return;
    const outfit = selectedItems.map((i) => items[i]);
    setCustomOutfits([...customOutfits, outfit]);
    setSelectedItems([]);
  };

  // Remove a saved custom outfit
  const handleRemoveCustomOutfit = (index) => {
    setCustomOutfits(customOutfits.filter((_, i) => i !== index));
  };

   // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-start justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl shadow-2xl p-8 space-y-8">
         {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-indigo-300 drop-shadow-md">
            Digital Closet Assistant
          </h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-1 bg-gray-100 dark:bg-gray-700 dark:text-white text-sm rounded shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

   {/* Add new wardrobe item */}
        <AddItemForm onAdd={handleAddItem} />

 {/* Search input */}
        <input
          type="text"
          placeholder="Search by name or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Filters for color, occasion, and season */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
            <option value="">All Colors</option>
            {["black", "white", "grey", "red", "blue", "green", "yellow", "pink", "purple", "brown", "beige", "orange", "navy", "teal"].map(color =>
              <option key={color} value={color}>{color}</option>
            )}
          </select>
          <select value={filterOccasion} onChange={(e) => setFilterOccasion(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
            <option value="">All Occasions</option>
            {["casual", "formal", "work", "party", "sport", "holiday", "date", "night out", "interview", "wedding"].map(occasion =>
              <option key={occasion} value={occasion}>{occasion}</option>
            )}
          </select>
          <select value={filterSeason} onChange={(e) => setFilterSeason(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
            <option value="">All Seasons</option>
            {["spring", "summer", "autumn", "winter"].map(season =>
              <option key={season} value={season}>{season}</option>
            )}
          </select>
        </div>

 {/* Outfit suggestion button */}
        <button
          onClick={handleSuggestOutfit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 mt-4 rounded shadow-md transition"
        >
          Suggest Outfit
        </button>

{/* Display suggested outfit */}
        {suggestedOutfit.length > 0 && (
          <div className="p-4 border border-indigo-300 dark:border-indigo-700 rounded bg-indigo-50 dark:bg-indigo-900 mt-4">
            <h2 className="text-xl font-semibold mb-2">Suggested Outfit:</h2>
            {suggestedOutfit.map((item, index) => (
              <div key={index} className="mb-2">
                <strong>{item.name}</strong> – {item.category} <br />
                <em>Color:</em> {item.color} | <em>Occasion:</em> {item.occasion} | <em>Season:</em> {item.season}
                {item.image && (
                  <div className="mt-1">
                    <img src={item.image} alt={item.name} className="w-24 h-auto" />
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={handleAddFavoriteOutfit}
              className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded transition"
            >
              ❤️ Save to Favorites
            </button>
          </div>
        )}

{/* Saved favorite outfits */}
        {favoriteOutfits.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">Saved Favorite Outfits</h2>
            <ul className="space-y-4">
              {favoriteOutfits.map((outfit, outfitIndex) => (
                <li key={outfitIndex} className="bg-pink-100 dark:bg-pink-900 border border-pink-300 dark:border-pink-800 p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Outfit #{outfitIndex + 1}</span>
                    <button
                      onClick={() => handleRemoveFavoriteOutfit(outfitIndex)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded shadow"
                    >
                      ❌ Remove
                    </button>
                  </div>
                  {outfit.map((item, i) => (
                    <div key={i} className="mb-2">
                      <strong>{item.name}</strong> – {item.category}<br />
                      <em>Color:</em> {item.color} | <em>Occasion:</em> {item.occasion} | <em>Season:</em> {item.season}
                      {item.image && (
                        <div className="mt-1">
                          <img src={item.image} alt={item.name} className="w-24 h-auto" />
                        </div>
                      )}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}

 {/* Custom manually built outfits */}
        {customOutfits.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold border-b pb-2 mb-4 mt-8">Custom Outfits</h2>
            <ul className="space-y-4">
              {customOutfits.map((outfit, index) => (
                <li key={index} className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded border">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Outfit #{index + 1}</span>
                    <button
                      onClick={() => handleRemoveCustomOutfit(index)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                    >
                      ❌ Remove
                    </button>
                  </div>
                  {outfit.map((item, i) => (
                    <div key={i} className="mb-2">
                      <strong>{item.name}</strong> – {item.category}<br />
                      <em>Color:</em> {item.color} | <em>Occasion:</em> {item.occasion} | <em>Season:</em> {item.season}
                      {item.image && (
                        <div className="mt-1">
                          <img src={item.image} alt={item.name} className="w-24 h-auto" />
                        </div>
                      )}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}

 {/* Wardrobe display with search/filtering and delete */}
        <div>
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">Wardrobe</h2>
          <ul>
            {items
              .filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase()))
              .filter(item =>
                (!filterColor || item.color?.toLowerCase() === filterColor.toLowerCase()) &&
                (!filterOccasion || item.occasion?.toLowerCase() === filterOccasion.toLowerCase()) &&
                (!filterSeason || item.season?.toLowerCase() === filterSeason.toLowerCase()))
              .map((item, index) => (
                <li key={index} className="bg-white dark:bg-gray-700 rounded shadow p-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(index)}
                        onChange={() => toggleSelectItem(index)}
                        className="accent-green-500 mr-2"
                      />
                      <strong>{item.name}</strong> – {item.category} <br />
                      <em>Color:</em> {item.color} | <em>Occasion:</em> {item.occasion} | <em>Season:</em> {item.season}
                      {item.image && <div className="mt-2"><img src={item.image} alt={item.name} className="w-24 h-auto" /></div>}
                    </div>
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="self-start sm:self-center bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded shadow transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>

 {/* Create custom outfit button */}
        {items.length > 1 && (
          <button
            onClick={handleCreateCustomOutfit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded shadow"
            disabled={selectedItems.length < 2}
          >
            ✅ Create Custom Outfit
          </button>
        )}

{/* Floating AI Chatbot */}
        <Chatbot items={items} />
      </div>
    </div>
  );
}

export default App;
