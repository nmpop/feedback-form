import * as React from "react";
import "./App.css";
import { FeedbackForm } from "./components/FeedbackForm";

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <FeedbackForm />
    </div>
  );
}

export default App;
