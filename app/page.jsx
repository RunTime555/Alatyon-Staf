// app/page.jsx
// Redirects root "/" to "/login"
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login");
}