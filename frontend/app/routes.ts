import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
    index("./routes/_index.tsx"),
  route("login", "./routes/auth.login.tsx"),
  route("register", "./routes/auth.register.tsx"),
  route(
    "/.well-known/appspecific/com.chrome.devtools.json",
    "./debug-null.tsx",
  ),

] satisfies RouteConfig;

