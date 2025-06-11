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
import { LoginSchema } from "@/schemas";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "An account with this email already exists. Please sign in with your existing account."
      : undefined;
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((response: any) => {
        if (response?.error) {
          form.reset();
          setError(response.error);
        }
        if (response?.success) {
          form.reset();
          setSuccess(response.success);
        }
        if (response?.twoFactor) {
          setTwoFactorCode(true);
        }
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
              {!twoFactorCode && (
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Sign In
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Enter your email to continue
                  </p>
                </div>
              )}
              {twoFactorCode && (
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Enter your 2FA token
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Enter your token to continue
                  </p>
                </div>
              )}

              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                {twoFactorCode && (
                  <div>
                    <input
                      {...form.register("code")}
                      disabled={isPending}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition focus;bg-gary-900 duration-200 text-sm"
                      placeholder="000_000"
                      autoComplete="code"
                    />
                    {form.formState.errors.code && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.code.message}
                      </p>
                    )}
                  </div>
                )}
                {!twoFactorCode && (
                  <>
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
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {form.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="text-left">
                      <button className="text-pink-500 hover:text-blue-300 text-xs transition duration-200 cursor-pointer">
                        <Link href="/reset">Forgot password?</Link>
                      </button>
                    </div>
                  </>
                )}

                <FormError message={error || urlError} />
                <FormSuccess message={success} />

                {/* Sign up button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white  py-2 px-3 rounded-md transition duration-200 transform  text-sm cursor-pointer"
                >
                  {!twoFactorCode &&
                    (isPending ? "Sign In..." : "Sign In with Email")}
                  {twoFactorCode ? "Continue" : ""}
                </button>
              </form>

              {!twoFactorCode && (
                <>
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
                      href={"/register"}
                      className="text-blue-400 hover:text-blue-300 text-xs transition duration-200 block w-full cursor-pointer mb-2"
                    >
                      Create your account
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
