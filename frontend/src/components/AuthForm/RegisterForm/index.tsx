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
import { RegisterSchema } from "@/schemas";
import { useSearchParams } from "next/navigation";
import { register } from "@/actions/register";
import Logo from "@/components/Logo";

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "An account with this email already exists. Please sign in with your existing account."
      : undefined;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const handleSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((response: any) => {
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
          href="/login"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Login
        </Link>
      </div>
      <div className="min-h-screen bg-black flex">
        {/* Left side - Testimonial */}
        <div className="hidden lg:flex lg:w-1/2 bg-pink-950/30 items-end pl-16 py-8">
          <div className="max-w-md">
            <blockquote className="text-white text-lg leading-relaxed">
              "This library has saved me countless hours of work and helped me
              deliver stunning designs to my clients faster than ever before."
            </blockquote>
            <cite className="text-pink-400 text-sm mt-4 block">
              - Sofia Davis
            </cite>
          </div>
        </div>

        {/* Right side - Sign up form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 border border-l-gray-800 ">
          <div className="w-full max-w-sm">
            {/* Sign up form */}
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Create an account
                </h1>
                <p className="text-gray-400 text-sm">
                  Enter your email below to create your account
                </p>
              </div>

              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="name"
                    {...form.register("name")}
                    disabled={isPending}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition focus;bg-gary-900 duration-200 text-sm"
                    placeholder="alice"
                    autoComplete="name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
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

                {/* Password field */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...form.register("password")}
                      disabled={isPending}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition focus;bg-gary-900 duration-200 text-sm"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition duration-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password field */}
                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...form.register("confirmPassword")}
                      disabled={isPending}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition focus;bg-gary-900 duration-200 text-sm"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...form.register("agreeToTerms")}
                    disabled={isPending}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-700 bg-gray-800 rounded"
                  />
                  <label className="ml-2 block text-xs text-gray-300">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-pink-500 hover:text-pink-400"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-pink-500 hover:text-pink-400"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <FormError message={error} />
                <FormSuccess message={success} />

                {/* Sign up button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white  py-2 px-3 rounded-md transition duration-200 transform  text-sm cursor-pointer"
                >
                  {isPending ? "Creating account..." : "Sign In with Email"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400 uppercase text-xs">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              {/* Social sign up buttons */}
              <div className="space-y-3">
                {socialProviders.map((provider, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleSocialSignUp(provider.name.toLowerCase())
                    }
                    className={`w-full ${provider.color} cursor-pointer transition duration-200 transform py-2 px-4 rounded-md flex items-center justify-center font-medium text-sm shadow-sm border border-gray-700`}
                    disabled={isPending}
                  >
                    <span className="text-lg mr-2">{provider.icon}</span>
                    <span
                      className={
                        provider.name === "Google"
                          ? "text-gray-700"
                          : "text-white"
                      }
                    >
                      {provider.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Terms and privacy */}
              <div className="text-center">
                <Link
                  href={"/login"}
                  className="text-blue-400 hover:text-blue-300 text-xs transition duration-200 block w-full cursor-pointer mb-2"
                >
                  Already have an account? Sign in
                </Link>

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

export default RegisterForm;
