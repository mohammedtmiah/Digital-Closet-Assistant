# Digital Closet Assistant

A web-based wardrobe management app built with React and Tailwind CSS. Users can upload and manage clothing items, generate outfit suggestions, create and save favorite outfits, build custom outfits, and interact with an AI assistant.

## Live Demo

Link: digital-closet-assistant.vercel.app

## Folder Structure

digital-closet-assistant/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── other static files
├── src/
│   ├── App.js
│   ├── AddItemForm.js
│   ├── Chatbot.js
│   ├── firebase.js
│   ├── index.js
│   └── index.css
├── .env
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── README.md

## Features

- Add wardrobe items with name, category, color, occasion, season, and image
- Image upload via drag-and-drop (Firebase Storage)
- Suggest outfits based on filters
- Save favorite outfits
- Build custom outfits from wardrobe items
- AI assistant for style suggestions
- Dark mode toggle
- LocalStorage for data persistence

## Technologies Used

- React
- Tailwind CSS
- Firebase (Storage)
- OpenAI API (Chatbot)
- Vercel (Hosting)

## Installation Instructions

1. Clone the repository:
   git clone https://github.com/mohammedtmiah/Digital-Closet-Assistant
   cd digital-closet-assistant

2. Install dependencies:
   npm install

3. Run the app:
   npm start

## Testing

- Add items
- Use filters and suggest outfit feature
- Save and remove favorite outfits
- Create custom outfits
- Use the chatbot
- Toggle dark/light mode

## License

This project is intended for educational purposes only.