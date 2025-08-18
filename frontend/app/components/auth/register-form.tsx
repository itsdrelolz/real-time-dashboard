import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const userData = Object.fromEntries(formData);

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: userData.displayname,
          email: userData.email,
          password: userData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed.");
        return;
          }
    
	const data = await response.json();
    
	if (data.session) { 
		localStorage.setItem('userSession', JSON.stringify(data.session));
	    }

	    




      // if successful redirect to the dashboard page
      navigate("/dashboard");

    } catch (err) {
      setError("Network error. Could not connect to the server.");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayname">Display name</Label>
                <Input id="displayname" name="displayname" type="text" placeholder="yourusername" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>

              {error && <p className="text-sm font-medium text-destructive">{error}</p>}

              <div className="flex flex-col gap-3 pt-2">
                <Button type="submit" className="w-full">Create Account</Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">Sign in</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

