import React, { forwardRef } from 'react';

export interface CertificateProps {
  studentName: string;
  courseName: string;
  cohort: string;
  duration: string;
  score: string;
  date: string;
  certId: string;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateProps>(({
  studentName,
  courseName,
  cohort,
  duration,
  score,
  date,
  certId
}, ref) => {
  return (
    <div 
      ref={ref} 
      className="relative w-[1123px] h-[794px] bg-[#1a1b2e] overflow-hidden font-sans shrink-0"
      style={{
        boxSizing: 'border-box'
      }}
    >
      {/* Background Shapes */}
      <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-200px] left-[-100px] w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00B4D8]/5 rounded-full blur-2xl"></div>

      {/* Borders */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-brand-orange z-20"></div>
      <div className="absolute top-0 left-0 bottom-0 w-4 bg-brand-orange z-20"></div>
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#00B4D8] z-20"></div>

      {/* Content Container */}
      <div className="absolute inset-0 p-16 pt-20 flex flex-col z-30">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-brand-orange">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                 <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
               </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white uppercase tracking-widest leading-none">Alpha Spark</span>
              <span className="text-brand-orange text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">Digital Workforce Development</span>
            </div>
          </div>

          <div className="bg-brand-orange py-3 px-8 shadow-lg transform translate-x-16">
            <h2 className="text-white font-black text-sm uppercase tracking-widest leading-tight text-center">
              Certificate<br/>Of Completion
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-4">
          <p className="text-brand-orange text-sm italic mb-6">Awarded to</p>
          
          <h1 className="text-[64px] font-black text-white mb-6 tracking-tight leading-none drop-shadow-md">
            {studentName}
          </h1>
          
          <div className="w-full max-w-3xl h-[3px] flex mx-auto mb-8">
            <div className="h-full bg-brand-orange flex-[1]"></div>
            <div className="h-full bg-white/20 flex-[2]"></div>
          </div>

          <p className="text-white/60 text-sm italic mb-6">For successfully completing</p>
          
          <h2 className="text-4xl font-bold text-brand-orange mb-16 drop-shadow-sm">
            {courseName}
          </h2>

          {/* Details Table */}
          <div className="w-full max-w-4xl border-t-[3px] border-brand-orange pt-5 pb-4">
            <div className="grid grid-cols-4 gap-4 text-left">
              <div>
                <p className="text-brand-orange text-[10px] font-black uppercase tracking-widest mb-1">Cohort</p>
                <p className="text-white font-bold text-lg">{cohort}</p>
              </div>
              <div>
                <p className="text-brand-orange text-[10px] font-black uppercase tracking-widest mb-1">Duration</p>
                <p className="text-white font-bold text-lg">{duration}</p>
              </div>
              <div>
                <p className="text-brand-orange text-[10px] font-black uppercase tracking-widest mb-1">Assessment Score</p>
                <p className="text-white font-bold text-lg">{score}</p>
              </div>
              <div>
                <p className="text-brand-orange text-[10px] font-black uppercase tracking-widest mb-1">Date</p>
                <p className="text-white font-bold text-lg">{date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Signatures */}
        <div className="grid grid-cols-3 gap-16 mt-16 px-12 text-center pb-8">
          <div>
            <div className="h-[2px] bg-white/20 w-full mb-3"></div>
            <p className="text-white font-bold text-[13px]">Ishaq Sulaiman</p>
            <p className="text-white/40 text-[9px] uppercase tracking-[0.15em] mt-0.5">Founder & CEO</p>
          </div>
          <div>
            <div className="h-[2px] bg-brand-orange w-full mb-3"></div>
            <p className="text-white font-bold text-[13px]">COO Signature</p>
            <p className="text-white/40 text-[9px] uppercase tracking-[0.15em] mt-0.5">Chief Operating Officer</p>
          </div>
          <div>
            <div className="h-[2px] bg-white/20 w-full mb-3"></div>
            <p className="text-white font-bold text-[13px]">Academy Director</p>
            <p className="text-white/40 text-[9px] uppercase tracking-[0.15em] mt-0.5">Alpha Spark Academy</p>
          </div>
        </div>

        {/* Verification Info */}
        <div className="absolute bottom-10 left-0 right-0 text-center flex justify-center items-center gap-4 text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] z-30">
          <span>Certificate ID: {certId}</span>
          <span className="w-1 h-1 rounded-full bg-brand-orange"></span>
          <span>Verified: talentcloud.alphaspark.tech</span>
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';
