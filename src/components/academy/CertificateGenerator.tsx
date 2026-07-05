import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Printer, Award, ShieldCheck, Download, Loader2 } from "lucide-react";
import { Course } from "../../data/courses";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
  
  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      const printArea = document.getElementById("print-area");
      if (!printArea) return;
      
      const canvas = await html2canvas(printArea, {
        scale: 2, // higher resolution
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // The print area is 960x640, which is an aspect ratio of 1.5
      // A4 landscape is 297x210, aspect ratio of ~1.414
      // We scale to fit
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
      // Fallback to print
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/95 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:block">
      {/* Hide surrounding UI during browser print */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: none;
            padding: 0;
            margin: 0;
            box-shadow: none;
            background: white !important;
            color: black !important;
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
                  <Printer className="w-4 h-4" /> Print / PDF
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
        <div className="bg-white/5 border border-white/10 p-4 rounded-[36px] overflow-x-auto">
          <div className="min-w-[800px]">
            <CertificateContent
              studentName={studentName}
              courseTitle={courseTitle}
              certificateId={certificateId}
              issueDate={issueDate}
            />
          </div>
        </div>
      </div>

      {/* Hidden print block that takes over when window.print() is called */}
      <div className="hidden print:block absolute inset-0 bg-white text-black">
        <CertificateContent
          studentName={studentName}
          courseTitle={courseTitle}
          certificateId={certificateId}
          issueDate={issueDate}
          isPrinting={true}
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
  isPrinting?: boolean;
}

function CertificateContent({
  studentName,
  courseTitle,
  certificateId,
  issueDate,
  isPrinting = false
}: CertificateContentProps) {
  // Generate verification URL
  const verifyUrl = `${window.location.origin}/academy/verify/${certificateId}`;
  
  return (
    <div
      id="print-area"
      className={`relative w-[960px] h-[640px] mx-auto border-[16px] p-16 flex flex-col justify-between items-center bg-white text-[#1A1A2E] select-none shadow-2xl overflow-hidden ${
        isPrinting 
          ? "border-[#1A1A2E]" 
          : "border-brand-navy rounded-[28px]"
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(232, 93, 4, 0.03) 0%, transparent 80%)`
      }}
    >
      {/* Corner Borders */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-brand-orange" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-brand-orange" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-brand-orange" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-brand-orange" />

      {/* Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <Award className="w-[400px] h-[400px]" />
      </div>

      {/* Top Header */}
      <div className="w-full flex justify-between items-center border-b border-gray-100 pb-6">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Alpha Spark Logo" className="w-10 h-10 object-contain filter invert" onError={(e) => {
            // Fallback if logo not found
            e.currentTarget.style.display = "none";
          }} />
          <span className="font-sans font-black text-xl tracking-tighter uppercase italic text-brand-navy">
            ALPHA <span className="text-brand-orange">SPARK</span>
          </span>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-orange">Verified Graduate</p>
          <p className="text-[10px] font-bold text-gray-500 font-mono">ID: {certificateId}</p>
        </div>
      </div>

      {/* Certificate Core Body */}
      <div className="text-center space-y-6 my-auto">
        <p className="font-serif italic text-base text-gray-400">This is to certify that</p>
        
        <h2 className="font-sans font-black text-4xl uppercase tracking-tight text-brand-navy italic border-b-2 border-brand-orange pb-2 px-10 inline-block">
          {studentName}
        </h2>

        <p className="font-serif italic text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
          has successfully completed all assignments, examinations, and attendance requirements to graduate from the professional track
        </p>

        <h3 className="font-sans font-black text-2xl uppercase tracking-wide text-brand-navy italic">
          {courseTitle}
        </h3>
      </div>

      {/* Bottom Signatures & QR Code */}
      <div className="w-full flex justify-between items-end border-t border-gray-100 pt-6">
        {/* Left: Issued Date & Authority */}
        <div className="space-y-1">
          <p className="font-mono text-[10px] font-bold text-brand-navy">DATE OF ISSUANCE</p>
          <p className="font-sans font-black text-sm uppercase text-gray-700">{issueDate}</p>
          <div className="w-32 h-0.5 bg-gray-200 mt-4" />
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Alpha Spark Admissions</p>
        </div>

        {/* Center: Stamp/Badge */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center border-2 border-brand-orange/30">
            <Award className="w-8 h-8 text-brand-orange" />
          </div>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">OFFICIAL SEAL</p>
        </div>

        {/* Right: Verification QR Code & Signature */}
        <div className="flex items-end gap-6">
          <div className="space-y-1 text-right">
            <p className="font-mono text-[10px] font-bold text-brand-navy">AUTHORIZED SIGNATURE</p>
            <p className="font-serif italic text-base text-brand-orange font-bold">Icedmist</p>
            <div className="w-32 h-0.5 bg-gray-200 mt-4 ml-auto" />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Director of Education</p>
          </div>
          
          {/* Mock QR Code for Verification */}
          <div className="flex flex-col items-center justify-center space-y-1 bg-white p-2 border border-gray-100 rounded-xl">
            <div className="w-14 h-14 bg-gray-100 flex flex-wrap p-1 gap-[2px]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 ${
                    (i % 3 === 0 || i % 4 === 1 || i === 0 || i === 2 || i === 13 || i === 15) 
                      ? "bg-brand-navy" 
                      : "bg-transparent"
                  }`} 
                />
              ))}
            </div>
            <span className="text-[6px] font-mono font-bold text-gray-400 uppercase">SCAN TO VERIFY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
