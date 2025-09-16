"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const Wrapper = styled.main`
  max-width: 420px;
  margin: 2rem auto;
  padding: 1.25rem;
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

  label { font-weight: 600; }
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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Inscription échouée");
      }

      // Auto sign-in after registration
      const login = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/" });
      if (login?.error) {
        router.push("/login");
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      setError(err?.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Wrapper>
      <Title>Inscription</Title>
      <form onSubmit={onSubmit}>
        <Field>
          <label htmlFor="name">Nom</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field>
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Btn type="submit" disabled={loading}>{loading ? "Création…" : "Créer un compte"}</Btn>
      </form>
    </Wrapper>
  );
}
