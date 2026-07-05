"use client";

import React, { useState, useRef } from "react";
import { X, Award, Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";

interface CertificateGeneratorProps {
  studentName: string;
  courseTitle: string;
  certificateId: string;
  issueDate: string;
  onClose: () => void;
}

export default function CertificateGenerator({
  studentName,
  courseTitle,
  certificateId,
  issueDate,
  onClose
}: CertificateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const getVerifyUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      return `http://verify.localhost:3000/${certificateId}`;
    }
    return `https://verify.alphaspark.ng/${certificateId}`;
  };

  const getVerifyHost = () => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      return 'verify.localhost:3000';
    }
    return 'verify.alphaspark.ng';
  };
  
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      if (!printRef.current) return;
      
      // Use html-to-image which supports modern CSS color functions (oklab, oklch, etc.)
      const pngDataUrl = await toPng(printRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#111322",
        style: {
          // Force the element to be visible and sized correctly during capture
          transform: "none",
        },
        filter: (node: HTMLElement) => {
          // Skip any nodes that might cause issues
          return true;
        },
      });
      
      // Create PDF from the captured PNG
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(pngDataUrl);
      const imgRatio = imgProps.width / imgProps.height;
      const pdfRatio = pdfWidth / pdfHeight;
      
      let finalWidth = pdfWidth;
      let finalHeight = pdfHeight;
      
      if (imgRatio > pdfRatio) {
        finalHeight = pdfWidth / imgRatio;
      } else {
        finalWidth = pdfHeight * imgRatio;
      }
      
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(pngDataUrl, "PNG", x, y, finalWidth, finalHeight);
      pdf.save(`AlphaSpark_Certificate_${certificateId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Something went wrong while creating your certificate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(10, 12, 30, 0.95)", backdropFilter: "blur(12px)" }}
    >
      <div className="w-full max-w-5xl space-y-6 my-8">
        {/* Controls Header */}
        <div className="flex items-center justify-between text-white px-6 py-4 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6" style={{ color: "#E85D04" }} />
            <div>
              <h3 className="font-black text-lg uppercase italic tracking-wider" style={{ fontFamily: "Arial, sans-serif" }}>
                Your Certified Credential
              </h3>
              <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace", fontSize: "10px" }}>
                ID: {certificateId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer"
              style={{
                background: isGenerating ? "rgba(232,93,4,0.5)" : "#E85D04",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                border: "none",
                opacity: isGenerating ? 0.6 : 1,
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download PDF
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="cursor-pointer"
              style={{
                padding: "10px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.6)",
                border: "none",
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Wrapper — this is what gets captured as PNG */}
        <div style={{
          background: "#111322",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "32px",
          borderRadius: "36px",
          overflowX: "auto",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
        }}>
          <div ref={printRef} style={{ flexShrink: 0, background: "#111322" }}>
            <CertificateContent
              studentName={studentName}
              courseTitle={courseTitle}
              certificateId={certificateId}
              issueDate={issueDate}
              verifyUrl={getVerifyUrl()}
              verifyHost={getVerifyHost()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface CertificateContentProps {
  studentName: string;
  courseTitle: string;
  certificateId: string;
  issueDate: string;
  verifyUrl: string;
  verifyHost: string;
}

/**
 * Certificate visual content — uses ONLY inline styles (no Tailwind classes)
 * to guarantee html-to-image captures it pixel-perfectly without any
 * CSS color function parsing issues.
 */
function CertificateContent({
  studentName,
  courseTitle,
  certificateId,
  issueDate,
  verifyUrl,
  verifyHost,
}: CertificateContentProps) {
  const ORANGE = "#E85D04";
  const BLUE   = "#00A3FF";
  const BG     = "#111322";
  const WHITE  = "#FFFFFF";
  const GRAY4  = "#9CA3AF";
  const GRAY5  = "#6B7280";
  const GRAY6  = "#4B5563";

  return (
    <div
      style={{
        position: "relative",
        width: 960,
        height: 640,
        background: BG,
        color: WHITE,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        fontFamily: "Arial, Helvetica, sans-serif",
        backgroundImage: `radial-gradient(circle at 70% 30%, rgba(232,93,4,0.08) 0%, transparent 60%)`,
      }}
    >
      {/* Left accent stripe */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 8, background: ORANGE, zIndex: 10 }} />
      
      {/* Bottom accent bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, display: "flex", zIndex: 10 }}>
        <div style={{ width: "50%", height: "100%", background: ORANGE }} />
        <div style={{ width: "50%", height: "100%", background: BLUE }} />
      </div>

      {/* Decorative blurs */}
      <div style={{ position: "absolute", top: -128, left: -128, width: 384, height: 384, background: `${ORANGE}0D`, borderRadius: "50%", filter: "blur(48px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -128, right: -128, width: 500, height: 500, background: `${BLUE}0D`, borderRadius: "50%", filter: "blur(48px)", pointerEvents: "none" }} />

      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: 48, paddingLeft: 64, paddingRight: 48, position: "relative", zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 900, fontSize: 28, letterSpacing: "-0.04em", textTransform: "uppercase", fontStyle: "italic", color: WHITE, lineHeight: 1 }}>
              ALPHA <span style={{ color: ORANGE }}>SPARK</span>
            </span>
            <span style={{ fontSize: 12, color: ORANGE, fontWeight: 500, marginTop: 4 }}>
              Digital Workforce Development
            </span>
          </div>
        </div>
        <div style={{ background: ORANGE, padding: "12px 32px", borderRadius: 2 }}>
          <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: WHITE, textAlign: "center", lineHeight: 1.8 }}>
            CERTIFICATE<br/>OF COMPLETION
          </div>
        </div>
      </div>

      {/* Center Body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 64px", position: "relative", zIndex: 20 }}>
        <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 16, color: GRAY4, marginBottom: 24 }}>
          Awarded to
        </p>
        
        <h1 style={{ fontWeight: 700, fontSize: 48, color: WHITE, marginBottom: 8, letterSpacing: "-0.02em" }}>
          {studentName}
        </h1>
        
        <div style={{ width: 480, height: 2, display: "flex", margin: "24px auto" }}>
          <div style={{ width: "50%", height: "100%", background: ORANGE }} />
          <div style={{ width: "50%", height: "100%", background: GRAY6 }} />
        </div>
        
        <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 14, color: GRAY4, marginBottom: 16 }}>
          For successfully completing
        </p>
        
        <h2 style={{ fontWeight: 900, fontSize: 28, color: ORANGE, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {courseTitle}
        </h2>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: "0 64px", margin: "0 32px", paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.1)", position: "relative", zIndex: 20 }}>
        {[
          { label: "COHORT", value: "#1.0" },
          { label: "DURATION", value: "12 Weeks" },
          { label: "ASSESSMENT SCORE", value: "Excellent" },
          { label: "DATE", value: issueDate },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: 10, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4, fontWeight: 700 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Signatures */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 96px", paddingBottom: 64, position: "relative", zIndex: 20 }}>
        {[
          { name: "Ishaq Sulaiman", title: "Founder & CEO" },
          { name: "COO Signature", title: "Chief Operating Officer" },
          { name: "Academy Director", title: "Alpha Spark Academy" },
        ].map((sig) => (
          <div key={sig.name} style={{ textAlign: "center", width: 160 }}>
            <div style={{ width: "100%", borderBottom: `1px solid ${GRAY5}`, marginBottom: 8 }} />
            <p style={{ fontSize: 12, fontWeight: 700, color: WHITE }}>{sig.name}</p>
            <p style={{ fontSize: 9, color: GRAY4, fontWeight: 500 }}>{sig.title}</p>
          </div>
        ))}
      </div>

      {/* Footer — QR Code + Cert ID */}
      <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: WHITE, padding: 4, borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
            <QRCodeSVG 
              value={verifyUrl}
              size={44}
              level="M"
            />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 9, color: GRAY4, fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: 4 }}>
              Certificate ID: <span style={{ color: WHITE, fontWeight: 700 }}>{certificateId}</span>
            </p>
            <p style={{ fontSize: 8, color: ORANGE, fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Verify at: {verifyHost}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
