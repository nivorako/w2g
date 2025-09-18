"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";

const PageWrap = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 1rem;
`;

const Lead = styled.p`
  color: #555;
  margin: 0 0 1.5rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled(Field)`
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  outline: none;
  font-size: 1rem;
  &:focus {
    border-color: var(--primary, #cf3201);
    box-shadow: 0 0 0 3px rgba(207, 50, 1, 0.12);
  }
`;

const StyledTextArea = styled.textarea`
  padding: 0.65rem 0.75rem;
  min-height: 140px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  outline: none;
  font-size: 1rem;
  resize: vertical;
  &:focus {
    border-color: var(--primary, #cf3201);
    box-shadow: 0 0 0 3px rgba(207, 50, 1, 0.12);
  }
`;

const ErrorText = styled.div`
  color: #c02626;
  font-size: 0.9rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Success = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #e9f8ef;
  color: #14532d;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
`;

const Failure = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #fee2e2;
  color: #7f1d1d;
  border: 1px solid #fecaca;
  border-radius: 8px;
`;

interface ContactValues {
  name: string;
  email: string;
  message: string;
}

const initialValues: ContactValues = {
  name: "",
  email: "",
  message: "",
};

const schema = Yup.object({
  name: Yup.string().trim().min(2, "Au moins 2 caractères").required("Nom requis"),
  email: Yup.string().trim().email("Email invalide").required("Email requis"),
  message: Yup.string().trim().min(10, "Au moins 10 caractères").required("Message requis"),
});

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    values: ContactValues,
    helpers: FormikHelpers<ContactValues>
  ) => {
    setSent(false);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Échec de l'envoi du message");
      }

      helpers.resetForm();
      setSent(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Une erreur est survenue";
      setError(msg);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <PageWrap>
      <Title>Contact</Title>
      <Lead>
        Une question, une demande d information ou une suggestion ? Remplissez le
        formulaire ci-dessous et nous vous répondrons rapidement.
      </Lead>

      <Card>
        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form noValidate>
              <FormRow>
                <FieldWrap>
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" name="name" type="text" placeholder="Votre nom" />
                  <ErrorMessage name="name" component={ErrorText} />
                </FieldWrap>

                <FieldWrap>
                  <Label htmlFor="email">Adresse email</Label>
                  <Input id="email" name="email" type="email" placeholder="vous@exemple.com" />
                  <ErrorMessage name="email" component={ErrorText} />
                </FieldWrap>
              </FormRow>

              <FieldWrap style={{ marginTop: "1rem" }}>
                <Label htmlFor="message">Message</Label>
                <Field id="message" name="message" as={StyledTextArea} placeholder="Votre message..." />
                <ErrorMessage name="message" component={ErrorText} />
              </FieldWrap>

              <Actions>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi..." : "Envoyer"}
                </Button>
              </Actions>

              {error && <Failure>{error}</Failure>}
              {sent && <Success>Merci ! Votre message a bien été envoyé.</Success>}
            </Form>
          )}
        </Formik>
      </Card>
    </PageWrap>
  );
}
