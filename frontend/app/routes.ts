import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [

  route("login", "./routes/login.tsx"),
  route("register", "./routes/register.tsx"),
  route(
    "/.well-known/appspecific/com.chrome.devtools.json",
    "./debug-null.tsx",
  ),

] satisfies RouteConfig;

