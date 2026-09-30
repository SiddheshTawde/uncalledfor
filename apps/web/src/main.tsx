import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import "./style.css";
import "@repo/ui/journal.css";

createRoot(document.getElementById("app")!).render(<App />);
