import { createSignal } from "solid-js";
import InputField from "../components/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";



function RegisterPage() {

    const [, { register }] = useAuth();

    const [firstName, setFirstName] = createSignal("");
    const [lastName, setLastName] = createSignal("");
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");

    const [error, setError] = createSignal("");

    const handleRegister = async (e: Event) => {
        e.preventDefault();
        try {
            await register(firstName(), lastName(), email(), password());
        } catch (error) {
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        }
    }

    return (
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-8">
                <div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create an account
                    </h2>
                </div>
                <form onSubmit={handleRegister} class="mt-8 space-y-6">
                    <div class="space-y-4">
                        <InputField name="name" type="text" placeholder="Enter your First Name" label="First Name" value={firstName()} onInput={e => setFirstName((e.target as HTMLInputElement).value)} />
                        <InputField name="name" type="text" placeholder="Enter your Last Name" label="Last Name" value={lastName()} onInput={e => setLastName((e.target as HTMLInputElement).value)} />
                        <InputField name="email" type="email" placeholder="Enter your email" label="Email address" value={email()} onInput={e => setEmail((e.target as HTMLInputElement).value)} />
                        <InputField name="password" type="password" placeholder="Enter your password" label="Password" value={password()} onInput={e => setPassword((e.target as HTMLInputElement).value)} />     
                    </div>
                    <div>
                        <Button type="submit" class="w-full">Create account</Button>
                        {error() && <p class="text-red-500">{error()}</p>}
                    </div>
                </form>
            </div>
        </div>
    )

    
}

export default RegisterPage;