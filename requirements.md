# Technical Requirements Specification

## 🎨 Frontend Stack (The Visual Application)
* **React.js:** Used to build a fully dynamic, component-driven user interface.
* **Tailwind CSS:** Used for styling the custom dashboard layout.
* **UI Design Rule:** **No Generic Templates.** The UI must be engineered from scratch as a professional healthcare dashboard. It needs a distinctive sidebar navigation element, action suggestion chips, alternating user/system dialogue bubbles, and a persistent medical disclaimer block.

## ⚙️ Backend Stack (The Core Server)
* **Python & FastAPI:** A high-performance, asynchronous web framework that will handle user chat requests and manage the application logic.

## 🧠 AI & RAG Architecture (The Knowledge Layer)
* **ChromaDB:** A specialized vector database used to store and rapidly retrieve chunks of trusted clinical literature.
* **LangChain:** The framework responsible for chaining the user's prompt together with retrieved data, forcing the AI to stay within strict informational boundaries.
