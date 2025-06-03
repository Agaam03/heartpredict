"use client";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormError from "../../form-error";
import FormSuccess from "../../form-success";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema, ResetSchema } from "@/schemas";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { reset } from "@/actions/reset";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "An account with this email already exists. Please sign in with your existing account."
      : undefined;
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values).then((response: any) => {
        setError(response.error);
        setSuccess(response.success);
      });
    });
  };

  const socialProviders = [
    { name: "Google", icon: <FcGoogle />, color: "bg-white hover:bg-gray-50" },
    {
      name: "Github",
      icon: <FaGithub />,
      color: "bg-gray-900 hover:bg-gray-800 text-white",
    },
  ];

  const handleSocialSignUp = (provider: string) => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-transparent flex justify-between items-center px-14 pt-3 pb-1">
        <Logo />
        <Link
          href="/register"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Register
        </Link>
      </div>

      <div className="min-h-screen bg-black flex ">
        {/* Left side - Testimonial */}
        <div className="hidden lg:flex lg:w-1/2 bg-pink-950/30 items-end pl-16 py-8">
          <div className="max-w-md">
            <blockquote className="text-white text-lg leading-relaxed text-justify">
              "This tool empowers patients to be proactive about their heart
              health. As a physician, I appreciate how it bridges technology
              with real medical insight."
            </blockquote>
            <cite className="text-pink-400 text-sm mt-4 block">
              - Dr. Emily Carter, Cardiologist
            </cite>
          </div>
        </div>

        {/* Right side - Sign up form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 border border-l-gray-800">
          <div className="w-full max-w-sm ">
            {/* Sign up form */}
            <div className="space-y-6">
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Forget your password ?
                </h1>
                <p className="text-gray-400 text-sm">
                  Enter your email to continue
                </p>
              </div>

              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                {/* Email field */}
                <div>
                  <input
                    type="email"
                    {...form.register("email")}
                    disabled={isPending}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition focus;bg-gary-900 duration-200 text-sm"
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <FormError message={error || urlError} />
                <FormSuccess message={success} />

                {/* Sign up button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white  py-2 px-3 rounded-md transition duration-200 transform  text-sm cursor-pointer"
                >
                  {isPending ? "Sent..." : "Request sent reset email"}
                </button>
              </form>

              {/* Terms and privacy */}
              <div className="text-center">
                <p className="text-gray-500 text-xs">
                  By clicking continue, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordForm;
