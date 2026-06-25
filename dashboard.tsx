import { useState } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const userName = localStorage.getItem("pavia_user_name") || "User";
  const [activeTab, setActiveTab] = useState("overview");

  function handleLogout() {
    localStorage.removeItem("pavia_user_name");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation - Responsive for desktop, stacks cleanly */}
      <aside className="w-full md:w-64 bg-[#131926] border-b md:border-b-0 md:border-r border-gray-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl font-bold text-[#00E5A3] tracking-tight font-display">Pavia</span>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "overview" ? "bg-[#00E5A3] text-[#0A0E17]" : "text-gray-400 hover:bg-[#1C2434] hover:text-white"}`}
            >
              📊 Overview
            </button>
            <button 
              onClick={() => setActiveTab("rent")}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "rent" ? "bg-[#00E5A3] text-[#0A0E17]" : "text-gray-400 hover:bg-[#1C2434] hover:text-white"}`}
            >
              🏠 Rent Finance
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "settings" ? "bg-[#00E5A3] text-[#0A0E17]" : "text-gray-400 hover:bg-[#1C2434] hover:text-white"}`}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-xl font-medium mt-6 md:mt-0 transition-all"
        >
          🚪 Log Out
        </button>
      </aside>

      {/* Main Interface Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <p className="text-gray-400 text-sm">Akwaaba back,</p>
          <h1 className="text-3xl font-bold mt-1 text-white">{userName}</h1>
        </header>

        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Savings Goals Card */}
            <div className="bg-[#131926] p-6 rounded-2xl border border-gray-800 shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">🎯 Savings Target</h3>
              <p className="text-3xl font-bold text-[#00E5A3] mb-4">₵24,500</p>
              <div className="w-full bg-[#0A0E17] rounded-full h-2">
                <div className="bg-[#00E5A3] h-2 rounded-full w-[65%]"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>65% completed</span>
                <span>Goal: ₵37,000</span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-[#131926] p-6 rounded-2xl border border-gray-800 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-200">⚡ Capital Actions</h3>
                <p className="text-sm text-gray-400">Quickly deposit, allocate to goals, or review market parameters.</p>
              </div>
              <button className="bg-[#1C2434] text-[#00E5A3] font-bold py-3 px-4 rounded-xl mt-4 hover:bg-[#253046] transition-all text-center w-full">
                Add Funds
              </button>
            </div>
          </div>
        )}

        {activeTab === "rent" && (
          <div className="bg-[#131926] p-6 rounded-2xl border border-gray-800 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">🏠 Rent Finance Planner</h3>
            <p className="text-sm text-gray-400 mb-6">Track tenancy deadlines, deposit micro-allocations, and manage your accommodation overheads easily.</p>
            <div className="p-4 bg-[#0A0E17] rounded-xl border border-gray-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">Next Planned Allocation</p>
                <p className="font-bold text-white mt-0.5">₵1,200 / Month</p>
              </div>
              <span className="text-xs bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20">Pending Launch</span>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-[#131926] p-6 rounded-2xl border border-gray-800 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">⚙️ Profile & Security</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Environment Mode</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">Production Ready</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-400">Account Owner</span>
                <span className="text-sm font-semibold">{userName}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
