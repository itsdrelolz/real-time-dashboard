import { Dashboard } from "~/components/dashboard/Dashboard"

export default function Home() { 
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gray-100 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Dashboard />
      </div>
    </div>
 
  );
}


