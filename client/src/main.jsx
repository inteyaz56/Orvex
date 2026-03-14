import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";
export const serverUrl ="https://orvex-gateway.onrender.com/health";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
