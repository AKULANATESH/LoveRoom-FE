import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Link, Stack } from "@mui/material";
import { getApiErrorMessage } from "@src/api/getApiErrorMessage";
import { useRegisterCouple } from "@src/auth/api/useRegisterCouple";
import { useAuthContext } from "@src/auth/useAuth";
import { TextInputField } from "@src/lib/formFields/TextInputField";
import { useToast } from "@src/lib/notifications/useToast";
import type { ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

import { AuthLayout } from "../components/AuthLayout";

const registerCoupleSchema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only"),
    partnerEmail: z.string().email("Enter your partner’s email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.email.toLowerCase() !== data.partnerEmail.toLowerCase(), {
    message: "Partner email must be different from yours",
    path: ["partnerEmail"],
  });

type RegisterCoupleForm = z.infer<typeof registerCoupleSchema>;

export function Register(): ReactElement {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, hasPartner, setAuthFromResponse } = useAuthContext();
  const form = useForm<RegisterCoupleForm>({
    resolver: zodResolver(registerCoupleSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      partnerEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerCouple = useRegisterCouple({
    onSuccess: (response) => {
      setAuthFromResponse(response);
      toast.showSuccessToast(
        "Your shared space is ready. We emailed your partner to set their username and password.",
      );
      navigate("/together");
    },
    onError: (error) => {
      toast.showErrorToast(
        getApiErrorMessage(error, "Could not create your accounts. Check details and try again."),
      );
    },
  });

  if (isAuthenticated && hasPartner) {
    return <Navigate to="/together" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/invite" />;
  }

  return (
    <AuthLayout
      title="Create your shared space"
      subtitle="Add both emails and one password. Your partner gets an email to choose their username and set a new password."
    >
      <FormProvider {...form}>
        <Stack
          component="form"
          spacing={2}
          onSubmit={form.handleSubmit((values) => {
            registerCouple.mutate({
              name: values.name,
              email: values.email,
              username: values.username,
              partnerEmail: values.partnerEmail,
              password: values.password,
            });
          })}
        >
          {registerCouple.isError ? (
            <Alert severity="error">
              {getApiErrorMessage(
                registerCouple.error,
                "Registration failed. Email or username may already exist.",
              )}
            </Alert>
          ) : null}
          <TextInputField name="name" label="Your name" autoComplete="name" />
          <TextInputField name="email" label="Your email" type="email" autoComplete="email" />
          <TextInputField
            name="username"
            label="Your username"
            helperText="Only you set a username here"
          />
          <TextInputField
            name="partnerEmail"
            label="Partner email"
            type="email"
            helperText="We’ll email them a link to set username and password"
          />
          <TextInputField
            name="password"
            label="Shared password"
            type="password"
            autoComplete="new-password"
          />
          <TextInputField
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={registerCouple.isPending}
          >
            {registerCouple.isPending ? "Creating accounts..." : "Create accounts"}
          </Button>
          <Link component={RouterLink} to="/login" underline="hover">
            Already have an account? Sign in
          </Link>
        </Stack>
      </FormProvider>
    </AuthLayout>
  );
}
