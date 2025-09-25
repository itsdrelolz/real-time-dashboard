import InputField from "../components/InputField";
import Button from "../components/ui/Button";
import { createSignal } from "solid-js";
import { useAuth } from "../context/AuthContext";

function LoginPage() {


    const [, { login }] = useAuth();

    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");

    const [error, setError] = createSignal("");

    
    
    const handleLogin = async (e: Event) => {
        e.preventDefault();
        setError("");
        try { 
            await login(email(), password());
        } catch (error) {
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        }
    }



    return (
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-8">
                <div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        Welcome back! Please enter your details.
                    </p>
                </div>
                <form onSubmit={handleLogin} class="mt-8 space-y-6">
                    <div class="space-y-4">
                        <InputField name="email" type="email" placeholder="Enter your email" label="Email address" value={email()} onInput={e => setEmail((e.target as HTMLInputElement).value)} />
                        <InputField name="password" type="password" placeholder="Enter your password" label="Password" value={password()} onInput={e => setPassword((e.target as HTMLInputElement).value)} />
                    </div>
                    <div>
                        <Button type="submit" class="w-full">Log in</Button>
                        {error() && <p class="text-red-500">{error()}</p>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;