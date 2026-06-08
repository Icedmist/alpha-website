import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { 
  X, Copy, Check, Send, Gift, Users, Award, 
  ChevronRight, Sparkles, Mail, ShieldAlert
} from "lucide-react";

interface ReferralModalProps {
  onClose: () => void;
}

export default function ReferralModal({ onClose }: ReferralModalProps) {
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState(
    "Hey! I'm learning high-income tech skills at Alpha Spark Academy. You should join the next cohort with me!"
  );
  
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!currentUser) return null;

  const referralCode = currentUser.id.toUpperCase().substring(2);
  const referralLink = `https://academy.alphaspark.tech/join?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail.trim()) return;

    setLoading(true);
    setSentSuccess(false);

    // Simulate server response
    setTimeout(() => {
      setLoading(false);
      setSentSuccess(true);
      setFriendEmail("");
      // Hide success notification after 4 seconds
      setTimeout(() => setSentSuccess(false), 4000);
    }, 1200);
  };

  // Mock reward benchmarks
  const rewards = [
    { target: 1, label: "1 Friend", reward: "10% Tuition Discount", unlocked: true },
    { target: 3, label: "3 Friends", reward: "30% Tuition Discount", unlocked: false },
    { target: 5, label: "5 Friends", reward: "100% Free Cohort Scholarship", unlocked: false }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#04060b]/90 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-brand-navy border border-white/10 rounded-[32px] overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
      >
        {/* Background Sparkles Grid */}
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-10" />

        {/* Modal Header */}
        <div className="relative p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange/15 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
              <Gift className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg md:text-xl uppercase italic tracking-tight text-white">
                Alpha Spark Referral Program
              </h3>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-0.5">Invite Friends & Earn Rewards</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer border border-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1">
          {/* Tagline Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-5">
              <Sparkles className="w-32 h-32 text-white" />
            </div>
            <p className="text-sm font-semibold text-white/95 leading-relaxed">
              Udemy-Standard Peer Program: For every peer who registers and enrolls in a paid track using your invite link, you both receive premium rewards. Your friend gets <span className="text-brand-orange font-bold">10% off</span> their course fee, and you stack rewards up to a <span className="text-brand-blue font-bold">100% Free Seat!</span>
            </p>
          </div>

          {/* Shareable Link Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-wider text-white/40 ml-2">Your Invitation Link</label>
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-4 pr-32 text-xs font-mono text-brand-blue outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`absolute right-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  copied 
                    ? "bg-[#3bb75e] text-white" 
                    : "bg-brand-orange hover:bg-brand-orange/95 text-white"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Invite via Email Form */}
          <form onSubmit={handleSendInvite} className="space-y-4 p-5 bg-white/2 border border-white/5 rounded-2xl">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/70 flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-orange" /> Invite Directly via Email
            </h4>

            {sentSuccess && (
              <div className="p-4 bg-[#3bb75e]/10 border border-[#3bb75e]/20 text-[#3bb75e] rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" /> Invitation email has been simulated and sent!
              </div>
            )}

            <div className="space-y-3">
              <input
                type="email"
                required
                placeholder="friend@domain.com"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-orange"
              />
              <textarea
                rows={2}
                required
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-orange resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white/5 hover:bg-brand-orange border border-white/10 hover:border-brand-orange text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> {loading ? "Sending Invitation..." : "Send Invitation"}
              </button>
            </div>
          </form>

          {/* Reward Timeline / Progress Benchmarks */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40 ml-2">Milestone Benchmarks</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {rewards.map((rew) => (
                <div 
                  key={rew.target} 
                  className={`border p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between ${
                    rew.unlocked 
                      ? "bg-brand-blue/10 border-brand-blue/30 text-white" 
                      : "bg-white/2 border-white/5 text-white/40"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest">{rew.label}</span>
                    {rew.unlocked && (
                      <span className="bg-[#3bb75e]/10 border border-[#3bb75e]/25 text-[#3bb75e] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className={`text-xs font-black uppercase tracking-tight ${rew.unlocked ? "text-white" : "text-white/30"}`}>
                      {rew.reward}
                    </p>
                    <p className="text-[9px] text-white/30 mt-1">Required: {rew.target} paid referral</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-white/5 bg-white/2 flex justify-between items-center text-[10px] text-white/30 font-semibold">
          <span>* Referral counts update on friend cohort checkout.</span>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); alert("Redirecting to full program Terms of Use (simulation)..."); }}
            className="hover:text-brand-orange transition-colors"
          >
            Terms & Conditions
          </a>
        </div>
      </motion.div>
    </div>
  );
}
