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

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = params.get("callbackUrl") ?? "/";

  async function onSubmit(e: FormEvent) {
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

  return (
    <Wrapper>
      <div>
      <Title>Connexion</Title>
      <form onSubmit={onSubmit}>
        <Field>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field>
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Btn type="submit" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</Btn>
      </form>
      </div>
    </Wrapper>
  );
}
