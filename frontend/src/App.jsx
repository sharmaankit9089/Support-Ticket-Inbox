import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Inbox from "./pages/Inbox";
import ProtectedRoute from "./auth/ProtectedRoute";

useEffect(() => {
    fetch(${import.meta.env.VITE_API_URL}/api/hello)
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(err => console.error(err));
  }, []);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
