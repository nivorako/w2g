"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

const Wrapper = styled.main`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;

    /* Constrain inner content width */
    & > * {
        width: 100%;
        max-width: 420px;
    }
`;

const Title = styled.h1`
    font-size: 1.6rem;
    margin-bottom: 1rem;
    color: var(--primary, #cf3201);
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 0.9rem;

    label {
        font-weight: 600;
    }
    input {
        padding: 0.6rem 0.7rem;
        border: 1px solid #ddd;
        border-radius: 8px;
    }
`;

const Btn = styled.button`
    width: 100%;
    padding: 0.7rem 1rem;
    border: none;
    border-radius: 8px;
    background: var(--primary, #cf3201);
    color: #fff;
    font-weight: 700;
    cursor: pointer;
`;

const ErrorMsg = styled.p`
    color: #b00020;
    margin: 0.5rem 0 0.75rem;
`;

/**
 * Page de connexion / inscription
 *
 * Cette page permet de se connecter ou de s'inscrire sur le site.
 *
 * Elle utilise les API `/api/auth/check-email`, `/api/auth/send-otp` et `/api/auth/verify-otp` pour vérifier l'email et le code OTP.
 *
 * Une fois l'email vérifié, elle utilise l'API `/api/register` pour créer le compte et l'API `/api/auth/signin` pour se connecter.
 *
 * @returns {JSX.Element} La page de connexion / inscription.
 */
export default function LoginPage() {
    const router = useRouter();
    const params = useSearchParams();
    const callbackUrl = params.get("callbackUrl") ?? "/";

    type Step = "email" | "password" | "otp" | "setPassword";
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [emailExists, setEmailExists] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    /**
     * Post a JSON object to a given URL.
     *
     * The function will return a Promise that resolves to the parsed JSON response.
     * If the response status is not OK (200-299), it will throw an Error with the error message if it can be parsed from the response body, otherwise it will throw an Error with the status code.
     *
     * @template T
     * @param {string} url The URL to send the POST request to.
     * @param {unknown} body The JSON object to send in the request body.
     * @returns {Promise<T>} A promise that resolves to the parsed JSON response.
     */
    async function postJSON<T>(url: string, body: unknown): Promise<T> {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            // try to parse error message
            try {
                const data = (await res.json()) as { error?: string };
                throw new Error(data.error || `Erreur ${res.status}`);
            } catch {
                throw new Error(`Erreur ${res.status}`);
            }
        }
        return (await res.json()) as T;
    }

    /**
     * Submits the email and checks if it exists in the database.
     * If it exists, it will proceed to the password step.
     * If it doesn't exist, it will send an OTP to the email and proceed to the OTP step.
     * @param {FormEvent} e - The form event.
     */
    async function onSubmitEmail(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setLoading(true);
        try {
            const data = await postJSON<{ exists: boolean }>("/api/auth/check-email", { email });
            setEmailExists(data.exists);
            if (data.exists) {
                setStep("password");
            } else {
                // send otp
                await postJSON<{ ok: boolean }>("/api/auth/send-otp", { email });
                setInfo("Un code vous a été envoyé par email. Saisissez-le ci-dessous.");
                setStep("otp");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inattendue");
        } finally {
            setLoading(false);
        }
    }

    /**
     * Submits the email and password, and signs in the user if they are correct.
     * If the email and password are incorrect, it will set an error message.
     * If the email and password are correct, it will redirect the user to the callback URL.
     * @param {FormEvent} e - The form event.
     */
    async function onSubmitPassword(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
        });
        setLoading(false);
        if (res?.error) {
            setError("Email ou mot de passe incorrect.");
            return;
        }
        router.replace(callbackUrl);
    }

    /**
     * Submits the OTP and checks if it is correct.
     * If the OTP is correct, it will redirect the user to the set password step.
     * If the OTP is incorrect or has expired, it will set an error message.
     * @param {FormEvent} e - The form event.
     */
    async function onSubmitOtp(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const data = await postJSON<{ valid: boolean }>("/api/auth/verify-otp", {
                email,
                code: otp,
            });
            if (!data.valid) {
                setError("Code invalide ou expiré.");
                return;
            }
            setStep("setPassword");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inattendue");
        } finally {
            setLoading(false);
        }
    }

    /**
     * Submits the registration form and creates a new account.
     * If the registration is successful, it will auto sign-in the user and redirect to the set callback URL.
     * If the registration fails, it will set an error message.
     * @param {FormEvent} e - The form event.
     */
    async function onSubmitRegister(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await postJSON("/api/register", {
                name: newName || undefined,
                email,
                password: newPassword,
                code: otp,
            });
            // auto sign-in, then redirect
            const res = await signIn("credentials", {
                email,
                password: newPassword,
                redirect: false,
                callbackUrl,
            });
            if (res?.error) {
                // fallback: go to login password step
                setStep("password");
                setError("Compte créé. Veuillez vous connecter avec votre mot de passe.");
            } else {
                router.replace(callbackUrl);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inattendue");
        } finally {
            setLoading(false);
        }
    }

    const title =
        step === "email"
            ? "Connexion"
            : step === "password"
              ? "Connexion"
              : step === "otp"
                ? "Vérification de l'email"
                : "Création du mot de passe";

    return (
        <Wrapper>
            <div>
                <Title>{title}</Title>

                {step === "email" && (
                    <form onSubmit={onSubmitEmail}>
                        <p>Entrez votre email pour continuer.</p>
                        <Field>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Field>
                        {error && <ErrorMsg>{error}</ErrorMsg>}
                        {info && <p>{info}</p>}
                        <Btn type="submit" disabled={loading}>
                            {loading ? "Vérification…" : "Suivant"}
                        </Btn>
                    </form>
                )}

                {step === "password" && (
                    <form onSubmit={onSubmitPassword}>
                        <p>
                            {emailExists ? "Email reconnu. " : ""}Veuillez saisir votre mot de passe
                            pour vous connecter.
                        </p>
                        <Field>
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Field>
                        {error && <ErrorMsg>{error}</ErrorMsg>}
                        <Btn type="submit" disabled={loading}>
                            {loading ? "Connexion…" : "Se connecter"}
                        </Btn>
                    </form>
                )}

                {step === "otp" && (
                    <form onSubmit={onSubmitOtp}>
                        <p>Nous avons envoyé un code à {email}. Entrez-le ci-dessous.</p>
                        <Field>
                            <label htmlFor="otp">Code OTP</label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                required
                            />
                        </Field>
                        {error && <ErrorMsg>{error}</ErrorMsg>}
                        <Btn type="submit" disabled={loading}>
                            {loading ? "Vérification…" : "Vérifier"}
                        </Btn>
                    </form>
                )}

                {step === "setPassword" && (
                    <form onSubmit={onSubmitRegister}>
                        <p>
                            Renseignez votre nom et créez votre mot de passe pour finaliser
                            l&apos;inscription.
                        </p>
                        <Field>
                            <label htmlFor="newName">Nom</label>
                            <input
                                id="newName"
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Votre nom (optionnel)"
                            />
                        </Field>
                        <Field>
                            <label htmlFor="newPassword">Mot de passe</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </Field>
                        {error && <ErrorMsg>{error}</ErrorMsg>}
                        <Btn type="submit" disabled={loading}>
                            {loading ? "Création…" : "Créer le compte"}
                        </Btn>
                    </form>
                )}
            </div>
        </Wrapper>
    );
}
