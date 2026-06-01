"use client";
import { createContext, useContext } from "react";
import { WalletReport } from "./report-types";
import { SAMPLE_REPORT } from "./sample-data";

// Build a default WalletReport from SAMPLE_REPORT for context default
const DEFAULT_REPORT: WalletReport = {
  ...SAMPLE_REPORT,
  isLive: false,
  fetchedAt: new Date().toISOString(),
};

const ReportContext = createContext<WalletReport>(DEFAULT_REPORT);

export function ReportProvider({
  report,
  children,
}: {
  report: WalletReport;
  children: React.ReactNode;
}) {
  return (
    <ReportContext.Provider value={report}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport(): WalletReport {
  return useContext(ReportContext);
}
