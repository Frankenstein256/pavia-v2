import { Switch, Route } from "wouter";
import Login from "./login";
import Dashboard from "./dashboard";

// High-end Landing Page Layout
const Home = () => (
  <div className="min-h-screen bg-[#0A0E17] text-white flex flex-col items-center justify-center p-6 text-center">
    <div className="w-12 h-12 rounded-full bg-[#00E5A3] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,229,163,0.3)]">
      <span className="text-[#0A0E17] font-black text-xl">P</span>
    </div>
    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white font-display">
      Pavia <span className="text-[#00E5A3]">Financial</span>
    </h1>
    <p className="text-gray-400 max-w-sm mb-8 text-sm md:text-base leading-relaxed">
      Premium capital management, rent financing, and workspace access built for the next generation of Ghanaian builders.
    </p>
    <a 
      href="/login" 
      className="bg-[#00E5A3] text-[#0A0E17] font-bold px-8 py-3.5 rounded-full hover:bg-[#00c48c] shadow-lg shadow-[#00E5A3]/20 transition-all text-sm tracking-wide"
    >
      Enter Portal
    </a>
  </div>
);

const SignupPlaceholder = () => (
  <div className="min-h-screen bg-[#0A0E17] text-white flex flex-col items-center justify-center p-6">
    <h1 className="text-2xl font-bold mb-2 text-gray-200">Create your Pavia Account</h1>
    <p className="text-gray-400 mb-6 text-sm">Registration protocols are currently restricted to private testing.</p>
    <a href="/login" className="text-[#00E5A3] text-sm underline hover:text-[#00c48c]">
      Return to secure login
    </a>
  </div>
);

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignupPlaceholder} />
      <Route path="/dashboard" component={Dashboard} />
      
      {/* 404 Guard */}
      <Route>
        <div className="min-h-screen bg-[#0A0E17] text-white flex flex-col items-center justify-center p-6">
          <h1 className="text-5xl font-black text-red-500/80 mb-2">404</h1>
          <p className="text-gray-400 text-sm mb-6">Security Perimeter Error: Page route does not exist.</p>
          <a href="/" className="text-[#00E5A3] text-sm underline hover:text-[#00c48c]">Return Home</a>
        </div>
      </Route>
    </Switch>
  );
}
