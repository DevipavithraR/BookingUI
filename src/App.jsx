import "./App.css";
import { RouterProvider } from "react-router-dom";
import ThemeWrapper from "./providers/ThemeWrapper";
import { router } from "./routes/router";
import { CustomToastContainer } from "./components/Notifications/ToastDemo";

function App() {
  return (
    <>
      <ThemeWrapper>
        <div className="app">
          <CustomToastContainer darkMode={true} />
          <RouterProvider router={router} />
        </div>
      </ThemeWrapper>
    </>
  );
}

export default App;
