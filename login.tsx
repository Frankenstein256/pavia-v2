import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: { email?: string; password?: string } = {};
    if (!form.email.includes("@")) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    return e;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    setLoading(true);

    // Secure Login Wall
    setTimeout(() => {
      const correctEmail = "frank@pavia.com";
      const correctPassword = "PaviaGhana2026"; 

      if (form.email.toLowerCase() === correctEmail && form.password === correctPassword) {
        localStorage.setItem("pavia_user_name", "Frank");
        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        setErrors({
          email: "Access Denied.",
          password: "Wrong email or password. Please try again."
        });
      }
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#131926] p-8 rounded-2xl border border-gray-800 shadow-xl">
        <h2 className="text-3xl font-bold text-[#00E5A3] mb-2 text-center">Pavia Login</h2>
        <p className="text-gray-400 text-sm text-center mb-6">Enter your credentials to manage your capital</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="frank@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#0A0E17] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5A3] transition-all"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[#0A0E17] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5A3] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00E5A3] text-[#0A0E17] font-bold py-3 rounded-xl mt-2 hover:bg-[#00c48c] transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
