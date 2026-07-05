"use client";

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  ShieldX, 
  Search, 
  Award, 
  Calendar, 
  BookOpen, 
  User, 
  Clock, 
  Hash, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles
} from "lucide-react";

interface CertificateData {
  id: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  issuedDate: string;
  assessmentScore: string;
  cohort: string;
  duration: string;
  institution: string;
}

interface VerificationResult {
  verified: boolean;
  certificate?: CertificateData;
  error?: string;
}

export default function CertificateVerification() {
  const { id: urlCertId } = useParams<{ id: string }>();
  const [certIdInput, setCertIdInput] = useState(urlCertId || "");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-verify if cert ID is in URL
  useEffect(() => {
    if (urlCertId && urlCertId.trim()) {
      setCertIdInput(urlCertId);
      verifyCertificate(urlCertId);
    }
  }, [urlCertId]);

  const verifyCertificate = async (id: string) => {
    const trimmedId = id.trim();
    if (!trimmedId) return;

    setIsLoading(true);
    setResult(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/verify?id=${encodeURIComponent(trimmedId)}`);
      const data = await res.json();

      if (res.ok && data.verified) {
        setResult({
          verified: true,
          certificate: data.certificate,
        });
      } else {
        setResult({
          verified: false,
          error: data.error || "Certificate not found. Please check the ID and try again.",
        });
      }
    } catch (err) {
      setResult({
        verified: false,
        error: "Could not connect to the verification service. Please check your internet connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCertificate(certIdInput);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "#0A0C1E" }}>
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: `radial-gradient(rgba(232,93,4,0.15) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, rgba(232,93,4,0.08) 0%, transparent 70%)",
      }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div style={{
              background: "rgba(232,93,4,0.15)",
              border: "1px solid rgba(232,93,4,0.3)",
              borderRadius: "16px",
              padding: "12px",
            }}>
              <ShieldCheck className="w-8 h-8" style={{ color: "#E85D04" }} />
            </div>
          </div>
          
          <h1 className="font-black text-3xl md:text-4xl tracking-tighter uppercase italic mb-3" style={{
            fontFamily: "Arial, sans-serif",
            color: "#FFFFFF",
          }}>
            Certificate <span style={{ color: "#E85D04" }}>Verification</span>
          </h1>
          
          <p className="text-sm md:text-base max-w-md mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            Verify the authenticity of an Alpha Spark Academy certificate by entering the Certificate ID or scanning the QR code on the certificate.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-10"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "rgba(255,255,255,0.25)" }} />
              <input
                type="text"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value.toUpperCase())}
                placeholder="Enter Certificate ID (e.g. AS-WEBDEV-ABC123)"
                className="w-full outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  padding: "16px 16px 16px 48px",
                  fontSize: "14px",
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "0.05em",
                }}
                id="cert-id-input"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !certIdInput.trim()}
              className="cursor-pointer flex items-center gap-2 shrink-0"
              style={{
                background: isLoading ? "rgba(232,93,4,0.5)" : "#E85D04",
                color: "#fff",
                padding: "16px 24px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                border: "none",
                opacity: (!certIdInput.trim() || isLoading) ? 0.5 : 1,
              }}
              id="verify-btn"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" /> Verify
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-16"
            >
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: "#E85D04" }} />
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                Verifying certificate...
              </p>
            </motion.div>
          )}

          {!isLoading && result && result.verified && result.certificate && (
            <motion.div
              key="verified"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {/* Verified Banner */}
              <div className="mb-6 flex items-center gap-4 p-5 rounded-2xl" style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}>
                <CheckCircle2 className="w-10 h-10 shrink-0" style={{ color: "#22C55E" }} />
                <div>
                  <h2 className="font-black text-lg uppercase tracking-wider" style={{ color: "#22C55E" }}>
                    Certificate Verified ✓
                  </h2>
                  <p className="text-xs mt-1" style={{ color: "rgba(34,197,94,0.7)" }}>
                    This certificate is authentic and was issued by Alpha Spark Academy.
                  </p>
                </div>
              </div>

              {/* Graduate Details Card */}
              <div className="rounded-3xl overflow-hidden" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                {/* Card Header */}
                <div className="p-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{
                      background: "rgba(232,93,4,0.15)",
                      borderRadius: "12px",
                      padding: "10px",
                    }}>
                      <Award className="w-6 h-6" style={{ color: "#E85D04" }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#E85D04" }}>
                        Certificate of Completion
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                        {result.certificate.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="p-6 space-y-5">
                  {/* Student Name */}
                  <DetailRow 
                    icon={<User className="w-5 h-5" />}
                    label="Graduate Name"
                    value={result.certificate.studentName}
                    highlight
                  />

                  {/* Course */}
                  <DetailRow 
                    icon={<BookOpen className="w-5 h-5" />}
                    label="Course / Track"
                    value={result.certificate.courseTitle}
                  />

                  {/* Assessment */}
                  <DetailRow 
                    icon={<Sparkles className="w-5 h-5" />}
                    label="Assessment Score"
                    value={result.certificate.assessmentScore}
                  />

                  {/* Cohort */}
                  <DetailRow 
                    icon={<Hash className="w-5 h-5" />}
                    label="Cohort"
                    value={result.certificate.cohort}
                  />

                  {/* Duration */}
                  <DetailRow 
                    icon={<Clock className="w-5 h-5" />}
                    label="Program Duration"
                    value={result.certificate.duration}
                  />

                  {/* Date */}
                  <DetailRow 
                    icon={<Calendar className="w-5 h-5" />}
                    label="Date Issued"
                    value={new Date(result.certificate.issuedDate).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  />
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" style={{ color: "#22C55E" }} />
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Issued by <span style={{ color: "#E85D04", fontWeight: 700 }}>{result.certificate.institution}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && result && !result.verified && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 p-6 rounded-2xl" style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}>
                <XCircle className="w-10 h-10 shrink-0" style={{ color: "#EF4444" }} />
                <div>
                  <h2 className="font-black text-lg uppercase tracking-wider" style={{ color: "#EF4444" }}>
                    Not Found
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "rgba(239,68,68,0.7)" }}>
                    {result.error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && !result && !hasSearched && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <ShieldCheck className="w-16 h-16 mx-auto mb-4" style={{ color: "rgba(255,255,255,0.06)" }} />
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.15)" }}>
                Enter a certificate ID above to verify
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Academy Link */}
        <div className="mt-12 text-center">
          <a 
            href={typeof window !== 'undefined' && window.location.hostname.includes('localhost') 
              ? 'http://localhost:3000' 
              : 'https://alphaspark.ng'}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Alpha Spark
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, highlight }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  highlight?: boolean; 
}) {
  return (
    <div className="flex items-start gap-4">
      <div style={{
        background: "rgba(232,93,4,0.1)",
        borderRadius: "10px",
        padding: "8px",
        color: "#E85D04",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          {label}
        </p>
        <p className="text-base font-bold" style={{ 
          color: highlight ? "#FFFFFF" : "rgba(255,255,255,0.7)",
          fontSize: highlight ? "20px" : "15px",
        }}>
          {value}
        </p>
      </div>
    </div>
  );
}
