import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { courses } from "../../data/courses";
import { 
  User, Lock, CreditCard, Gift, Github, Linkedin, 
  Check, Save, Eye, EyeOff, AlertCircle, Calendar, Receipt, FileText
} from "lucide-react";

const AVATAR_GRADIENTS = [
  { name: "Alpha Classic", class: "from-brand-orange to-brand-blue" },
  { name: "Sunset Gold", class: "from-amber-500 to-rose-500" },
  { name: "Ocean Breeze", class: "from-cyan-500 to-blue-600" },
  { name: "Purple Neon", class: "from-purple-600 to-pink-500" },
  { name: "Emerald Mint", class: "from-emerald-500 to-teal-600" },
  { name: "Mystic Charcoal", class: "from-slate-700 to-slate-900" }
];

export default function AccountCenter() {
  const { currentUser, updateUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "security" | "billing" | "referrals">("profile");

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [headline, setHeadline] = useState(currentUser?.headline || "");
  const [biography, setBiography] = useState(currentUser?.biography || "");
  const [website, setWebsite] = useState(currentUser?.website || "");
  const [githubLink, setGithubLink] = useState(currentUser?.githubLink || "");
  const [linkedinLink, setLinkedinLink] = useState(currentUser?.linkedinLink || "");
  const [selectedGradient, setSelectedGradient] = useState(currentUser?.avatarGradient || "from-brand-orange to-brand-blue");

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status indicators
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [securityMessage, setSecurityMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setLoading(true);

    try {
      updateUser({
        ...currentUser,
        name,
        phone,
        headline,
        biography,
        website,
        githubLink,
        linkedinLink,
        avatarGradient: selectedGradient
      });
      setProfileMessage({ type: "success", text: "Profile settings saved successfully!" });
    } catch (err: any) {
      setProfileMessage({ type: "error", text: err.message || "Could not save profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setSecurityMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    setLoading(true);

    // Simulated update in localStorage
    try {
      const storedRaw = localStorage.getItem("alpha_academy_users");
      if (storedRaw) {
        const db: any[] = JSON.parse(storedRaw);
        const index = db.findIndex((u) => u.id === currentUser.id);
        
        if (index !== -1) {
          // Check current password
          if (db[index].password !== currentPassword) {
            setSecurityMessage({ type: "error", text: "Incorrect current password." });
            setLoading(false);
            return;
          }

          // Update password
          db[index].password = newPassword;
          localStorage.setItem("alpha_academy_users", JSON.stringify(db));
          
          setSecurityMessage({ type: "success", text: "Password updated successfully!" });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setSecurityMessage({ type: "error", text: "User record not found." });
        }
      } else {
        setSecurityMessage({ type: "error", text: "Local database error." });
      }
    } catch (err: any) {
      setSecurityMessage({ type: "error", text: "Could not update credentials." });
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceDownload = (invoiceId: string) => {
    alert(`Generating invoice ${invoiceId}.pdf (simulation)... Download complete!`);
  };

  // Mock Billing History based on enrolled courses
  const getMockBillingHistory = () => {
    return currentUser.enrolledCourses.map((courseId, index) => {
      const courseObj = courses.find((c) => c.id === courseId);
      const title = courseObj ? courseObj.title : "Custom Digital Track";
      const amount = courseObj ? `₦${courseObj.price?.toLocaleString() || "150,000"}` : "₦150,000";

      return {
        id: `INV-${courseId.toUpperCase().substring(0, 4)}-${10023 + index}`,
        date: new Date(Date.now() - (index + 1) * 15 * 24 * 3600 * 1000).toLocaleDateString(),
        course: title,
        method: index % 2 === 0 ? "Paystack Card" : "Flutterwave Bank Transfer",
        amount: index === 0 && currentUser.id === "u-student" ? "Free (Scholarship)" : amount,
        status: "Completed"
      };
    });
  };

  // Mock Referrals Info
  const mockReferralList: any[] = [];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Account Center</p>
        <h2 className="font-display font-black text-3xl md:text-4xl uppercase italic tracking-tight mt-2">
          Profile & Account Management
        </h2>
        <p className="text-white/40 text-sm mt-1 italic">Update your profile settings, security credentials, and view billing logs.</p>
      </div>

      {/* Udemy-style Sub-navigation Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto gap-2 sm:gap-6">
        <button
          onClick={() => setActiveSubTab("profile")}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-all cursor-pointer ${
            activeSubTab === "profile" 
              ? "border-brand-orange text-white" 
              : "border-transparent text-white/40 hover:text-white/80"
          }`}
        >
          <span className="flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Public Profile
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab("security")}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-all cursor-pointer ${
            activeSubTab === "security" 
              ? "border-brand-orange text-white" 
              : "border-transparent text-white/40 hover:text-white/80"
          }`}
        >
          <span className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Security Settings
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab("billing")}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-all cursor-pointer ${
            activeSubTab === "billing" 
              ? "border-brand-orange text-white" 
              : "border-transparent text-white/40 hover:text-white/80"
          }`}
        >
          <span className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5" /> Billing & Invoices
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab("referrals")}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-all cursor-pointer ${
            activeSubTab === "referrals" 
              ? "border-brand-orange text-white" 
              : "border-transparent text-white/40 hover:text-white/80"
          }`}
        >
          <span className="flex items-center gap-2">
            <Gift className="w-3.5 h-3.5" /> Referrals Activity
          </span>
        </button>
      </div>

      {/* Main Tab Panels */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-10 shadow-2xl">
        {activeSubTab === "profile" && (
          <form onSubmit={handleProfileSave} className="space-y-8">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white pb-2 border-b border-white/5 flex items-center gap-2">
              <User className="text-brand-orange" /> Public Profile Settings
            </h3>

            {profileMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                profileMessage.type === "success" 
                  ? "bg-[#3bb75e]/10 border border-[#3bb75e]/20 text-[#3bb75e]" 
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                <AlertCircle className="w-4 h-4" /> {profileMessage.text}
              </div>
            )}

            {/* Avatar Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Select Avatar Design</label>
              <div className="flex flex-wrap items-center gap-6 p-6 bg-white/2 border border-white/5 rounded-3xl">
                {/* Active Avatar Preview */}
                <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${selectedGradient} flex items-center justify-center text-3xl font-bold text-white uppercase shadow-lg shadow-black/30 border border-white/15`}>
                  {name.charAt(0) || currentUser.name.charAt(0)}
                </div>

                {/* Selection Presets */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs text-white/70 font-semibold mb-3">Custom Color Gradient Presets:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {AVATAR_GRADIENTS.map((grad) => (
                      <button
                        type="button"
                        key={grad.name}
                        onClick={() => setSelectedGradient(grad.class)}
                        className={`w-10 h-10 rounded-full bg-gradient-to-tr ${grad.class} border-2 hover:scale-110 transition-transform relative flex items-center justify-center cursor-pointer ${
                          selectedGradient === grad.class ? "border-brand-orange" : "border-transparent"
                        }`}
                        title={grad.name}
                      >
                        {selectedGradient === grad.class && (
                          <div className="absolute inset-0 m-auto w-5 h-5 bg-white/25 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-brand-orange outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-brand-orange outline-none"
                />
              </div>
            </div>

            {/* Biography Details */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Professional Headline</label>
              <input
                type="text"
                placeholder="e.g. Aspiring Web Developer | Gombe Tech Hub Scholar"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-brand-orange outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Biography / About Yourself</label>
              <textarea
                rows={4}
                placeholder="Write a brief bio about your learning goals and career objectives..."
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none resize-none"
              />
            </div>

            {/* Socials */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">GitHub Profile Link</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://github.com/yourusername"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3.5 pl-12 text-sm text-white focus:border-brand-orange outline-none"
                  />
                  <Github className="absolute left-4 top-4 text-white/20 w-4 h-4" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">LinkedIn Profile Link</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/yourusername"
                    value={linkedinLink}
                    onChange={(e) => setLinkedinLink(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3.5 pl-12 text-sm text-white focus:border-brand-orange outline-none"
                  />
                  <Linkedin className="absolute left-4 top-4 text-white/20 w-4 h-4" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> {loading ? "Saving Details..." : "Save Profile"}
            </button>
          </form>
        )}

        {activeSubTab === "security" && (
          <form onSubmit={handleSecuritySave} className="space-y-8">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white pb-2 border-b border-white/5 flex items-center gap-2">
              <Lock className="text-brand-orange" /> Account Security settings
            </h3>

            {securityMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                securityMessage.type === "success" 
                  ? "bg-[#3bb75e]/10 border border-[#3bb75e]/20 text-[#3bb75e]" 
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                <AlertCircle className="w-4 h-4" /> {securityMessage.text}
              </div>
            )}

            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3.5 pl-12 text-sm text-white focus:border-brand-orange outline-none"
                  />
                  <Lock className="absolute left-4 top-4 text-white/20 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-4 text-white/20 hover:text-white transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3.5 pl-12 text-sm text-white focus:border-brand-orange outline-none"
                  />
                  <Lock className="absolute left-4 top-4 text-white/20 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-4 text-white/20 hover:text-white transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3.5 pl-12 text-sm text-white focus:border-brand-orange outline-none"
                  />
                  <Lock className="absolute left-4 top-4 text-white/20 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-4 text-white/20 hover:text-white transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> {loading ? "Updating credentials..." : "Change Password"}
            </button>
          </form>
        )}

        {activeSubTab === "billing" && (
          <div className="space-y-8">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white pb-2 border-b border-white/5 flex items-center gap-2">
              <CreditCard className="text-brand-orange" /> Transaction Logs & Receipts
            </h3>

            {getMockBillingHistory().length === 0 ? (
              <div className="bg-white/2 border border-white/5 p-12 text-center rounded-3xl">
                <p className="text-white/40 italic">No payment history found. Once you enroll in paid digital tracks, your statements will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 font-black uppercase tracking-wider">
                      <th className="pb-4 pr-4 pl-2">Invoice ID</th>
                      <th className="pb-4 pr-4">Purchase Date</th>
                      <th className="pb-4 pr-4">Academy Track</th>
                      <th className="pb-4 pr-4">Payment Source</th>
                      <th className="pb-4 pr-4">Price Paid</th>
                      <th className="pb-4 pr-4">Status</th>
                      <th className="pb-4 pl-2 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMockBillingHistory().map((invoice) => (
                      <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="py-4 pr-4 pl-2 font-mono font-bold text-brand-blue">{invoice.id}</td>
                        <td className="py-4 pr-4 font-medium text-white/75">{invoice.date}</td>
                        <td className="py-4 pr-4 font-bold text-white uppercase tracking-tight">{invoice.course}</td>
                        <td className="py-4 pr-4 text-white/50">{invoice.method}</td>
                        <td className="py-4 pr-4 font-black text-white">{invoice.amount}</td>
                        <td className="py-4 pr-4">
                          <span className="bg-[#3bb75e]/10 border border-[#3bb75e]/25 text-[#3bb75e] px-2 py-0.5 rounded-[6px] font-black uppercase tracking-wider text-[8px]">
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-4 pl-2 text-right">
                          <button
                            onClick={() => handleInvoiceDownload(invoice.id)}
                            className="bg-white/5 hover:bg-brand-orange hover:text-white border border-white/10 px-3 py-1.5 rounded-lg font-black uppercase tracking-wider text-[8px] transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                          >
                            <Receipt className="w-3 h-3" /> Get PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "referrals" && (
          <div className="space-y-8">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white pb-2 border-b border-white/5 flex items-center gap-2">
              <Gift className="text-brand-orange" /> Referral Conversions
            </h3>

            {/* referral stats summary card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/2 border border-white/5 p-6 rounded-2xl text-center space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/40">Total Invited</p>
                <p className="text-3xl font-black text-brand-blue">
                  {mockReferralList.length} {mockReferralList.length === 1 ? "Friend" : "Friends"}
                </p>
              </div>
              <div className="bg-white/2 border border-white/5 p-6 rounded-2xl text-center space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/40">Conversions</p>
                <p className="text-3xl font-black text-green-400">
                  {mockReferralList.filter(ref => ref.status === "Enrolled").length} Enrolled
                </p>
              </div>
              <div className="bg-white/2 border border-white/5 p-6 rounded-2xl text-center space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/40">Discount Earned</p>
                <p className="text-3xl font-black text-brand-orange">
                  {mockReferralList.filter(ref => ref.status === "Enrolled").length * 10}% Off
                </p>
              </div>
            </div>

            {/* List of Referred Friends */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Your Invitation Logs</h4>
              {mockReferralList.length === 0 ? (
                <div className="bg-white/2 border border-white/5 p-8 text-center rounded-2xl text-white/40 italic">
                  No referral conversions yet. Share your code to earn discounts.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 font-black uppercase tracking-wider">
                        <th className="pb-4 pr-4 pl-2">Name</th>
                        <th className="pb-4 pr-4">Invited Date</th>
                        <th className="pb-4 pr-4">Status</th>
                        <th className="pb-4 pl-2 text-right">Reward Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockReferralList.map((ref, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                          <td className="py-4 pr-4 pl-2 font-bold text-white">{ref.name}</td>
                          <td className="py-4 pr-4 font-mono font-medium text-white/50">{ref.date}</td>
                          <td className="py-4 pr-4">
                            <span className={`px-2 py-0.5 rounded-[6px] font-black uppercase tracking-wider text-[8px] border ${
                              ref.status === "Enrolled" 
                                ? "bg-green-500/10 border-green-500/25 text-green-400" 
                                : "bg-amber-500/10 border-amber-500/25 text-amber-400"
                            }`}>
                              {ref.status}
                            </span>
                          </td>
                          <td className="py-4 pl-2 text-right font-black uppercase text-[10px] tracking-wide text-brand-blue">
                            {ref.reward}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
