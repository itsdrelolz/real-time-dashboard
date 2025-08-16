import type { Route } from "./+types/home";
import Login from "~/login/page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
// make dashboard the default page, but redirect to login if not authenticated 
export default function Home() {
  return <Login />;
}
