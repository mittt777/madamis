import { createRoot } from "react-dom/client";
import { Component } from "./component";

const App = () => {
  return (
    <>
      Hello, <Component />
    </>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
