import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  route("/", "./components/layout/ProtectedRoute.tsx", [
    index("./routes/_index.tsx"),

  ]),

  route("/login", "./routes/auth.login.tsx"),
  route("/register", "./routes/auth.register.tsx"),
] satisfies RouteConfig;

