import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";


const root = document.getElementById("root")!

render(
    () => (
        <AuthProvider>
        <Router>
          <Route path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
        </Router>
        </AuthProvider>
    ),
    root!
);