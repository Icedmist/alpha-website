import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, Shield, Landmark, Smartphone, RefreshCw, CheckCircle2 } from "lucide-react";
import { Course } from "../../data/courses";

interface PaymentSimulatorProps {
  course: Course;
  onSuccess: (paymentGateway: "Paystack" | "Flutterwave", reference: string) => void;
  onClose: () => void;
}

export default function PaymentSimulator({ course, onSuccess, onClose }: PaymentSimulatorProps) {
  const [gateway, setGateway] = useState<"Paystack" | "Flutterwave" | null>(null);
  const [method, setMethod] = useState<"card" | "bank" | "ussd">("card");
  const [step, setStep] = useState<"select" | "details" | "processing" | "success">("select");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const handleSelectGateway = (selected: "Paystack" | "Flutterwave") => {
    setGateway(selected);
    setStep("details");
  };

  const handlePay = () => {
    if (method === "card" && (cardNumber.length < 12 || cardExpiry.length < 4 || cardCvv.length < 3)) {
      setError("Please fill out all card fields with valid information");
      return;
    }
    
    setError("");
    setStep("processing");
    const ref = `AS-TX-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setReference(ref);

    // Simulate network latency
    setTimeout(() => {
      setStep("success");
      // Simulate success callback after a brief delay
      setTimeout(() => {
        if (gateway) {
          onSuccess(gateway, ref);
        }
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white text-[#333333] rounded-3xl shadow-2xl overflow-hidden font-sans border border-white/10"
      >
        {/* Header */}
        <div className={`p-6 flex items-center justify-between text-white ${
          gateway === "Paystack" ? "bg-[#3bb75e]" : gateway === "Flutterwave" ? "bg-[#fbba14]" : "bg-brand-navy"
        } transition-colors duration-300`}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/75">Secured Gateway</p>
            <h3 className="text-lg font-bold">
              {gateway ? `${gateway} Sandbox` : "Choose Checkout Method"}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-white min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center py-4">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Enrolling for</p>
                  <h4 className="text-xl font-extrabold text-brand-navy mt-1">{course.title}</h4>
                  <p className="text-2xl font-black text-brand-orange mt-2">{course.fee}</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => handleSelectGateway("Paystack")}
                    className="w-full p-4 flex items-center justify-between border-2 border-gray-100 hover:border-[#3bb75e] rounded-2xl transition-all group hover:bg-[#3bb75e]/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#3bb75e]/15 flex items-center justify-center text-[#3bb75e]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-brand-navy text-sm">Pay with Paystack</p>
                        <p className="text-[10px] text-gray-400">Cards, Transfer, Bank, USSD</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#3bb75e] group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <button
                    onClick={() => handleSelectGateway("Flutterwave")}
                    className="w-full p-4 flex items-center justify-between border-2 border-gray-100 hover:border-[#fbba14] rounded-2xl transition-all group hover:bg-[#fbba14]/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#fbba14]/15 flex items-center justify-center text-[#fbba14]">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-brand-navy text-sm">Pay with Flutterwave</p>
                        <p className="text-[10px] text-gray-400">Card, Mobile Money, Bank Transfer</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#fbba14] group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Method Tabs */}
                <div className="flex border-b border-gray-100 mb-4">
                  {(["card", "bank", "ussd"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setMethod(t)}
                      className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-colors ${
                        method === t 
                          ? gateway === "Paystack" ? "border-[#3bb75e] text-[#3bb75e]" : "border-[#fbba14] text-brand-navy"
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {error && <p className="text-xs font-bold text-red-500">{error}</p>}

                {method === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4012 8831 9921 4452"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-navy"
                        />
                        <CreditCard className="absolute right-4 top-3.5 w-4 h-4 text-gray-300" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, "").replace(/(\d{2})/g, "$1/").replace(/\/$/, "").substring(0, 5))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-navy"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CVV</label>
                        <input
                          type="password"
                          placeholder="***"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-navy"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Card PIN (For demo)</label>
                      <input
                        type="password"
                        placeholder="****"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-navy"
                      />
                    </div>
                  </div>
                )}

                {method === "bank" && (
                  <div className="py-6 text-center space-y-4">
                    <Landmark className="w-12 h-12 mx-auto text-gray-300" />
                    <div>
                      <p className="font-extrabold text-sm text-brand-navy">Simulated Bank Transfer</p>
                      <p className="text-xs text-gray-400 mt-1">Transfer {course.fee} to the escrow account details shown upon initiating.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase">Wema Bank (Alat/Paystack)</p>
                      <p className="font-mono text-base font-black text-brand-navy">9920144521</p>
                      <p className="text-[10px] font-bold text-gray-500">Alpha Spark Academy Escrow</p>
                    </div>
                  </div>
                )}

                {method === "ussd" && (
                  <div className="py-6 text-center space-y-4">
                    <Smartphone className="w-12 h-12 mx-auto text-gray-300" />
                    <div>
                      <p className="font-extrabold text-sm text-brand-navy">Simulated USSD Payment</p>
                      <p className="text-xs text-gray-400 mt-1">Dial the code on your registered mobile number:</p>
                    </div>
                    <p className="font-mono text-xl font-black text-brand-orange py-2 px-6 bg-brand-orange/10 rounded-xl inline-block">
                      *737*1*2*{course.fee.replace(/\D/g, "")}#
                    </p>
                  </div>
                )}

                <button
                  onClick={handlePay}
                  className={`w-full py-4 text-white rounded-2xl font-black uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 ${
                    gateway === "Paystack" 
                      ? "bg-[#3bb75e] hover:bg-[#329e50]" 
                      : "bg-brand-navy hover:bg-brand-navy/90"
                  }`}
                >
                  <Shield className="w-4 h-4" /> Pay {course.fee}
                </button>
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 flex flex-col items-center justify-center space-y-6"
              >
                <RefreshCw className="w-12 h-12 text-brand-orange animate-spin" />
                <div className="text-center space-y-2">
                  <p className="font-black text-brand-navy uppercase tracking-wider text-sm">Authorizing Payment</p>
                  <p className="text-xs text-gray-400">Verifying security codes and account balance...</p>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 flex flex-col items-center justify-center space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-[#3bb75e]/10 text-[#3bb75e] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-xl text-brand-navy uppercase tracking-tight">Payment Approved!</h4>
                  <p className="text-xs text-gray-400">Transaction completed successfully.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-1 w-full font-mono text-[10px]">
                  <p className="text-gray-400">Gateway: <span className="font-bold text-gray-700">{gateway}</span></p>
                  <p className="text-gray-400">Amount Paid: <span className="font-bold text-gray-700">{course.fee}</span></p>
                  <p className="text-gray-400">Reference: <span className="font-bold text-gray-700">{reference}</span></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-center gap-2 border-t border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5 text-[#3bb75e]" /> PCI-DSS Compliant & Sandbox Verified
        </div>
      </motion.div>
    </div>
  );
}
