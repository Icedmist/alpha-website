"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { X, Printer, Award, ShieldCheck, Download, Loader2 } from "lucide-react";
import { Course } from "../../data/courses";
import { jsPDF } from "jspdf";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

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
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const getVerifyUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      return `http://${window.location.host}/verify/${certificateId}`;
    }
    return `https://verify.alphaspark.ng/${certificateId}`;
  };
  
  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      // ── Draw certificate directly on a native canvas (bypasses html2canvas + oklab issues) ──
      const W = 1920;        // canvas width  (2× of 960 for retina)
      const H = 1280;        // canvas height (2× of 640)
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Colors
      const BG        = "#111322";
      const ORANGE    = "#E85D04";
      const BLUE      = "#00A3FF";
      const WHITE     = "#FFFFFF";
      const GRAY400   = "#9CA3AF";
      const GRAY500   = "#6B7280";
      const GRAY600   = "#4B5563";
      const DIVIDER   = "rgba(255,255,255,0.1)";

      // ── Background ──
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // Radial glow top-right
      const grad = ctx.createRadialGradient(W * 0.7, H * 0.3, 0, W * 0.7, H * 0.3, W * 0.5);
      grad.addColorStop(0, "rgba(232,93,4,0.08)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // ── Accent left stripe ──
      ctx.fillStyle = ORANGE;
      ctx.fillRect(0, 0, 8, H);

      // ── Bottom accent bar ──
      ctx.fillStyle = ORANGE;
      ctx.fillRect(0, H - 8, W / 2, 8);
      ctx.fillStyle = BLUE;
      ctx.fillRect(W / 2, H - 8, W / 2, 8);

      // ── Logo text (top-left) ──
      ctx.textBaseline = "top";
      ctx.fillStyle = WHITE;
      ctx.font = "900 italic 48px Arial, Helvetica, sans-serif";
      ctx.fillText("ALPHA", 64, 46);
      const alphaW = ctx.measureText("ALPHA ").width;
      ctx.fillStyle = ORANGE;
      ctx.fillText("SPARK", 64 + alphaW, 46);
      ctx.fillStyle = ORANGE;
      ctx.font = "500 22px Arial, Helvetica, sans-serif";
      ctx.fillText("Digital Workforce Development", 64, 100);

      // ── Certificate of Completion badge (top-right) ──
      const badgeW = 220;
      const badgeH = 64;
      const badgeX = W - 80 - badgeW;
      const badgeY = 46;
      ctx.fillStyle = ORANGE;
      ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
      ctx.fillStyle = WHITE;
      ctx.font = "900 18px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CERTIFICATE", badgeX + badgeW / 2, badgeY + 14);
      ctx.fillText("OF COMPLETION", badgeX + badgeW / 2, badgeY + 38);
      ctx.textAlign = "left";

      // ── Center body ──
      ctx.textAlign = "center";

      // "Awarded to"
      ctx.fillStyle = GRAY400;
      ctx.font = "italic 28px Georgia, 'Times New Roman', serif";
      ctx.fillText("Awarded to", W / 2, H * 0.32);

      // Student Name
      ctx.fillStyle = WHITE;
      ctx.font = "bold 84px Arial, Helvetica, sans-serif";
      ctx.fillText(studentName, W / 2, H * 0.43);

      // Divider line
      const divY = H * 0.48;
      ctx.fillStyle = ORANGE;
      ctx.fillRect(W / 2 - 240, divY, 240, 3);
      ctx.fillStyle = GRAY600;
      ctx.fillRect(W / 2, divY, 240, 3);

      // "For successfully completing"
      ctx.fillStyle = GRAY400;
      ctx.font = "italic 24px Georgia, 'Times New Roman', serif";
      ctx.fillText("For successfully completing", W / 2, H * 0.55);

      // Course Title
      ctx.fillStyle = ORANGE;
      ctx.font = "900 52px Arial, Helvetica, sans-serif";
      // Wrap if too long
      const maxTitleW = W - 200;
      if (ctx.measureText(courseTitle.toUpperCase()).width > maxTitleW) {
        ctx.font = "900 40px Arial, Helvetica, sans-serif";
      }
      ctx.fillText(courseTitle.toUpperCase(), W / 2, H * 0.63);

      // ── Stats row ──
      const statsY = H * 0.72;
      const statsLabels = ["COHORT", "DURATION", "ASSESSMENT SCORE", "DATE"];
      const statsValues = ["#1.0", "12 Weeks", "Excellent", issueDate];
      const statsCols = 4;
      const statsStartX = 180;
      const statsColW = (W - 360) / statsCols;

      ctx.textBaseline = "top";
      for (let i = 0; i < statsCols; i++) {
        const cx = statsStartX + statsColW * i + statsColW / 2;
        ctx.fillStyle = ORANGE;
        ctx.font = "bold 16px Arial, Helvetica, sans-serif";
        ctx.fillText(statsLabels[i], cx, statsY);
        ctx.fillStyle = WHITE;
        ctx.font = "bold 24px Arial, Helvetica, sans-serif";
        ctx.fillText(statsValues[i], cx, statsY + 26);
      }

      // Stats bottom divider
      ctx.strokeStyle = DIVIDER;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, statsY + 70);
      ctx.lineTo(W - 100, statsY + 70);
      ctx.stroke();

      // ── Signatures ──
      const sigY = H * 0.82;
      const sigPositions = [W * 0.18, W * 0.5, W * 0.82];
      const sigNames = ["Ishaq Sulaiman", "COO Signature", "Academy Director"];
      const sigTitles = ["Founder & CEO", "Chief Operating Officer", "Alpha Spark Academy"];

      for (let i = 0; i < 3; i++) {
        const sx = sigPositions[i];
        // Line
        ctx.strokeStyle = GRAY500;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx - 100, sigY);
        ctx.lineTo(sx + 100, sigY);
        ctx.stroke();
        // Name
        ctx.fillStyle = WHITE;
        ctx.font = "bold 20px Arial, Helvetica, sans-serif";
        ctx.fillText(sigNames[i], sx, sigY + 10);
        // Title
        ctx.fillStyle = GRAY400;
        ctx.font = "500 15px Arial, Helvetica, sans-serif";
        ctx.fillText(sigTitles[i], sx, sigY + 36);
      }

      // ── QR Code (grab from hidden QRCodeCanvas in DOM) ──
      const qrContainer = qrCanvasRef.current;
      if (qrContainer) {
        const qrCanvas = qrContainer.querySelector("canvas");
        if (qrCanvas) {
          const qrSize = 88;
          const qrX = W / 2 - 140;
          const qrY = H - 100;
          // White background for QR
          ctx.fillStyle = WHITE;
          ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);
          ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
          
          // Cert ID text
          ctx.textAlign = "left";
          ctx.fillStyle = GRAY400;
          ctx.font = "16px 'Courier New', monospace";
          ctx.fillText(`Certificate ID:`, qrX + qrSize + 16, qrY + 20);
          ctx.fillStyle = WHITE;
          ctx.font = "bold 16px 'Courier New', monospace";
          ctx.fillText(certificateId, qrX + qrSize + 16, qrY + 42);
          ctx.fillStyle = ORANGE;
          ctx.font = "14px 'Courier New', monospace";
          const verifyHost = typeof window !== 'undefined' && window.location.hostname.includes('localhost')
            ? `${window.location.host}/verify`
            : 'verify.alphaspark.ng';
          ctx.fillText(`Verify at: ${verifyHost}`, qrX + qrSize + 16, qrY + 64);
        }
      }

      ctx.textAlign = "left";

      // ── Generate PDF ──
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
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

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
      pdf.save(`AlphaSpark_Certificate_${certificateId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was a problem generating your certificate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/95 backdrop-blur-md overflow-y-auto print:p-0 print:bg-transparent print:static print:block">
      {/* Hide surrounding UI during browser print */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-container, #print-container * {
            visibility: visible;
          }
          #print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: none;
            padding: 0;
            margin: 0;
            box-shadow: none;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-5xl space-y-6 no-print my-8">
        {/* Controls Header */}
        <div className="flex items-center justify-between text-white bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-brand-orange animate-pulse" />
            <div>
              <h3 className="font-display font-black text-lg uppercase italic tracking-wider">Your Certified Credential</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">ID: {certificateId}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
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
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Wrapper for screen */}
        <div className="bg-[#111322] border border-white/10 p-8 rounded-[36px] overflow-x-auto shadow-2xl flex justify-center">
          <div id="print-container" ref={printRef} className="shrink-0 bg-[#111322]">
            <CertificateContent
              studentName={studentName}
              courseTitle={courseTitle}
              certificateId={certificateId}
              issueDate={issueDate}
            />
          </div>
        </div>
      </div>

      {/* Hidden QR canvas for PDF renderer to grab pixels from */}
      <div ref={qrCanvasRef} style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <QRCodeCanvas 
          value={getVerifyUrl()}
          size={128}
          level="M"
        />
      </div>
    </div>
  );
}

interface CertificateContentProps {
  studentName: string;
  courseTitle: string;
  certificateId: string;
  issueDate: string;
}

function CertificateContent({
  studentName,
  courseTitle,
  certificateId,
  issueDate,
}: CertificateContentProps) {
  return (
    <div
      className="relative w-[960px] h-[640px] bg-[#111322] text-white flex flex-col justify-between overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 70% 30%, rgba(232, 93, 4, 0.08) 0%, transparent 60%)`
      }}
    >
      {/* Accent Borders */}
      <div className="absolute top-0 left-0 bottom-0 w-4 bg-brand-orange z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-4 flex z-10">
        <div className="w-[50%] h-full bg-brand-orange" />
        <div className="w-[50%] h-full bg-[#00A3FF]" />
      </div>

      {/* Decorative background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#00A3FF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex justify-between items-start pt-12 pl-16 pr-12 relative z-20">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Alpha Spark" className="w-10 h-10 object-contain filter invert" onError={(e) => {
            e.currentTarget.style.display = "none";
          }} />
          <div className="flex flex-col">
            <span className="font-sans font-black text-2xl tracking-tighter uppercase italic text-white leading-none">
              ALPHA <span className="text-brand-orange">SPARK</span>
            </span>
            <span className="text-[11px] text-brand-orange font-medium mt-1">Digital Workforce Development</span>
          </div>
        </div>
        <div className="bg-brand-orange px-8 py-3 rounded-sm">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-white text-center leading-relaxed">
            CERTIFICATE<br/>OF COMPLETION
          </h2>
        </div>
      </div>

      {/* Center Body */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-16 relative z-20">
        <p className="font-serif italic text-base text-gray-400 mb-6">Awarded to</p>
        
        <h1 className="font-sans font-bold text-5xl text-white mb-2 tracking-tight">
          {studentName}
        </h1>
        
        <div className="w-[480px] h-1 flex my-6 mx-auto">
          <div className="w-1/2 h-full bg-brand-orange" />
          <div className="w-1/2 h-full bg-gray-600" />
        </div>
        
        <p className="font-serif italic text-sm text-gray-400 mb-4">
          For successfully completing
        </p>
        
        <h2 className="font-sans font-black text-3xl text-brand-orange tracking-wide uppercase">
          {courseTitle}
        </h2>
      </div>

      {/* Stats Columns */}
      <div className="grid grid-cols-4 gap-4 px-16 mx-8 pb-6 border-b border-white/10 relative z-20">
        <div className="text-center">
          <p className="text-[10px] text-brand-orange uppercase tracking-widest mb-1 font-bold">COHORT</p>
          <p className="text-sm font-bold text-white">#1.0</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-brand-orange uppercase tracking-widest mb-1 font-bold">DURATION</p>
          <p className="text-sm font-bold text-white">12 Weeks</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-brand-orange uppercase tracking-widest mb-1 font-bold">ASSESSMENT SCORE</p>
          <p className="text-sm font-bold text-white">Excellent</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-brand-orange uppercase tracking-widest mb-1 font-bold">DATE</p>
          <p className="text-sm font-bold text-white">{issueDate}</p>
        </div>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-end px-24 pb-16 relative z-20">
        <div className="text-center w-40">
          <div className="w-full border-b border-gray-500 mb-2"></div>
          <p className="text-xs font-bold text-white">Ishaq Sulaiman</p>
          <p className="text-[9px] text-gray-400 font-medium">Founder & CEO</p>
        </div>
        <div className="text-center w-40">
          <div className="w-full border-b border-gray-500 mb-2"></div>
          <p className="text-xs font-bold text-white">COO Signature</p>
          <p className="text-[9px] text-gray-400 font-medium">Chief Operating Officer</p>
        </div>
        <div className="text-center w-40">
          <div className="w-full border-b border-gray-500 mb-2"></div>
          <p className="text-xs font-bold text-white">Academy Director</p>
          <p className="text-[9px] text-gray-400 font-medium">Alpha Spark Academy</p>
        </div>
      </div>

      {/* Footer ID and QR */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center z-20">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-sm shadow-sm">
            <QRCodeSVG 
              value={typeof window !== 'undefined' && window.location.hostname.includes('localhost') 
                ? `http://${window.location.host}/verify/${certificateId}` 
                : `https://verify.alphaspark.ng/${certificateId}`}
              size={44}
              level="M"
            />
          </div>
          <div className="text-left">
            <p className="text-[9px] text-gray-400 font-mono tracking-wider mb-1">
              Certificate ID: <span className="text-white font-bold">{certificateId}</span>
            </p>
            <p className="text-[8px] text-brand-orange font-mono tracking-wider uppercase">
              Verify at: {typeof window !== 'undefined' && window.location.hostname.includes('localhost') 
                ? `${window.location.host}/verify` 
                : 'verify.alphaspark.ng'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

