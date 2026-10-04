"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MessageSquare,
  Mail,
  ShieldCheck,
  Smartphone,
  Send,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Lock,
  Globe,
  Sliders,
  Clock,
  Check,
  Eye,
  FileText,
  UserCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  INITIAL_SMS_CONFIG,
  INITIAL_EMAIL_CONFIG,
  INITIAL_OTP_RULES,
  INITIAL_COMM_LOGS,
  SMSGatewayConfig,
  EmailGatewayConfig,
  OTPVerificationRules,
  CommunicationLogItem,
} from "@/data/shipping-communications-data";

export default function AdminCommunicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlTab = searchParams.get("tab") || "sms";
  const [activeTab, setActiveTab] = useState<"sms" | "email" | "otp" | "logs">(
    urlTab === "email" || urlTab === "otp" || urlTab === "logs" ? urlTab : "sms"
  );

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "sms" || tabParam === "email" || tabParam === "otp" || tabParam === "logs") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (key: "sms" | "email" | "otp" | "logs") => {
    setActiveTab(key);
    if (key === "sms") {
      router.push("/admin/communications");
    } else {
      router.push(`/admin/communications?tab=${key}`);
    }
  };

  // State for configs
  const [smsConfig, setSmsConfig] = useState<SMSGatewayConfig>(INITIAL_SMS_CONFIG);
  const [emailConfig, setEmailConfig] = useState<EmailGatewayConfig>(INITIAL_EMAIL_CONFIG);
  const [otpRules, setOtpRules] = useState<OTPVerificationRules>(INITIAL_OTP_RULES);
  const [logs, setLogs] = useState<CommunicationLogItem[]>(INITIAL_COMM_LOGS);

  // Test send states
  const [testPhone, setTestPhone] = useState<string>("01711234567");
  const [isSendingSMS, setIsSendingSMS] = useState<boolean>(false);
  const [smsNotice, setSmsNotice] = useState<string | null>(null);

  const [testEmail, setTestEmail] = useState<string>("concierge@inspirelifestyle.com");
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);

  // OTP Simulator State
  const [simulatedOTP, setSimulatedOTP] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState<number>(120);
  const [testInputOTP, setTestInputOTP] = useState<string>("");
  const [otpVerifyResult, setOtpVerifyResult] = useState<"success" | "fail" | null>(null);

  // Save Settings State
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  // Log search & filter
  const [logSearch, setLogSearch] = useState<string>("");
  const [logChannelFilter, setLogChannelFilter] = useState<string>("all");

  const handleSendTestSMS = () => {
    if (!testPhone) return;
    setIsSendingSMS(true);
    setSmsNotice(null);

    setTimeout(() => {
      setIsSendingSMS(false);
      const newBalance = smsConfig.balanceSMS - 1;
      setSmsConfig((prev) => ({ ...prev, balanceSMS: newBalance }));

      const newLog: CommunicationLogItem = {
        id: `log-${Date.now()}`,
        timestamp: "Just now",
        channel: "SMS",
        recipient: testPhone,
        recipientName: "Test Recipient",
        eventType: "Order Placed",
        status: "Delivered",
        contentSnippet: `Dear Patron, your Inspire Lifestyle order #ORD-TEST-99 of BDT 4,200 has been verified.`,
        gatewayResponse: `200 OK · ${smsConfig.provider.toUpperCase()} · MSGID: GW-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setLogs((prev) => [newLog, ...prev]);
      setSmsNotice(`Test SMS dispatched to ${testPhone} successfully! Remaining: ${newBalance}`);
      setTimeout(() => setSmsNotice(null), 4000);
    }, 1000);
  };

  const handleSendTestEmail = () => {
    if (!testEmail) return;
    setIsSendingEmail(true);
    setEmailNotice(null);

    setTimeout(() => {
      setIsSendingEmail(false);
      const newLog: CommunicationLogItem = {
        id: `log-${Date.now()}`,
        timestamp: "Just now",
        channel: "Gmail SMTP",
        recipient: testEmail,
        recipientName: "Admin Test",
        eventType: "Order Placed",
        status: "Delivered",
        contentSnippet: `HTML Luxury Invoice for Inspire Lifestyle order #ORD-TEST-99 dispatched.`,
        gatewayResponse: `250 2.0.0 OK (smtp.gmail.com) accepted for delivery`,
      };

      setLogs((prev) => [newLog, ...prev]);
      setEmailNotice(`Official HTML invoice dispatched to ${testEmail} via Gmail SMTP.`);
      setTimeout(() => setEmailNotice(null), 4000);
    }, 1200);
  };

  const handleGenerateSimulatedOTP = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOTP(code);
    setOtpTimer(120);
    setTestInputOTP("");
    setOtpVerifyResult(null);

    const newLog: CommunicationLogItem = {
      id: `log-${Date.now()}`,
      timestamp: "Just now",
      channel: "SMS OTP",
      recipient: "+880 1711-234567",
      recipientName: "Patron Checkout",
      eventType: "OTP Verification",
      status: "Sent",
      contentSnippet: `${code} is your Inspire Lifestyle verification code. Valid for 2 mins.`,
      gatewayResponse: `200 OK · OTP Gateway Dispatched`,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleVerifySimulatedOTP = () => {
    if (testInputOTP === simulatedOTP) {
      setOtpVerifyResult("success");
    } else {
      setOtpVerifyResult("fail");
    }
  };

  const handleSavePolicy = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    const q = logSearch.toLowerCase().trim();
    return logs.filter((log) => {
      const matchChannel =
        logChannelFilter === "all" ||
        log.channel.toLowerCase().includes(logChannelFilter.toLowerCase());
      const matchQuery =
        !q ||
        log.recipient.toLowerCase().includes(q) ||
        log.recipientName.toLowerCase().includes(q) ||
        log.contentSnippet.toLowerCase().includes(q);

      return matchChannel && matchQuery;
    });
  }, [logs, logChannelFilter, logSearch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-balance flex items-center gap-2.5">
            <span>Communications</span>
            <Badge variant="outline" className="text-xs font-mono">
              Gateways & OTP
            </Badge>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-pretty">
            SMS gateways, Gmail SMTP notifications, and checkout OTP rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSavePolicy}
            className="gap-1.5 shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save configurations</span>
          </Button>
        </div>
      </div>

      {isSavedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>All gateway API keys, templates, and OTP fraud rules updated successfully.</span>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
            Remaining SMS balance
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            {smsConfig.balanceSMS.toLocaleString()} SMS
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">
            Provider: {smsConfig.provider.toUpperCase()}
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            Gmail SMTP server
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
            Connected (587 TLS)
          </div>
          <div className="text-[10px] text-zinc-400 truncate">
            {emailConfig.senderEmail}
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            Checkout OTP verification
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
            {otpRules.enabledOnCheckout ? "Enforced" : "Disabled"}
          </div>
          <div className="text-[10px] text-zinc-400">
            {otpRules.mandatoryForCOD ? "Required for COD" : "Optional"}
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-zinc-400" />
            Total dispatched
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 tabular-nums">
            1,280 sent
          </div>
          <div className="text-[10px] text-zinc-400 tabular-nums">
            99.8% delivery rate
          </div>
        </Card>
      </div>

      {/* Main Tabs Segmented Bar */}
      <div className="inline-flex p-1 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 text-xs overflow-x-auto max-w-full">
        {[
          { key: "sms", label: "Bulk SMS gateway", icon: Smartphone },
          { key: "email", label: "Gmail & SMTP", icon: Mail },
          { key: "otp", label: "OTP & verification", icon: ShieldCheck },
          { key: "logs", label: "Dispatch logs", count: logs.length, icon: Clock },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key as any)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full tabular-nums ${isActive ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800 font-semibold" : "bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MOBILE BULK SMS GATEWAY */}
      {activeTab === "sms" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-150">
          {/* Left Column: Config & Templates (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>SMS gateway credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">
                    SMS gateway provider
                  </label>
                  <select
                    value={smsConfig.provider}
                    onChange={(e) =>
                      setSmsConfig((p) => ({ ...p, provider: e.target.value as any }))
                    }
                    className="w-full h-9 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="greenweb">Greenweb SMS (BD Masking / Non-Masking)</option>
                    <option value="mimsms">Alpha SMS / MimSMS</option>
                    <option value="grameenphone">Grameenphone Corporate Gateway</option>
                    <option value="banglalink">Banglalink Enterprise SMS</option>
                    <option value="twilio">Twilio Global API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 font-medium mb-1">
                    Sender ID / Masking name
                  </label>
                  <Input
                    type="text"
                    value={smsConfig.senderId}
                    onChange={(e) => setSmsConfig((p) => ({ ...p, senderId: e.target.value }))}
                    className="text-xs font-mono font-bold h-9 uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-500 font-medium mb-1">
                    Live gateway API token / secret
                  </label>
                  <Input
                    type="password"
                    value={smsConfig.apiKey}
                    onChange={(e) => setSmsConfig((p) => ({ ...p, apiKey: e.target.value }))}
                    className="text-xs font-mono h-9"
                  />
                </div>
              </div>

              {/* Event Triggers */}
              <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-900 text-xs">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Automated customer notifications
                </h4>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={smsConfig.autoOrderConfirmation}
                    onChange={(e) =>
                      setSmsConfig((p) => ({ ...p, autoOrderConfirmation: e.target.checked }))
                    }
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Send SMS immediately upon order placement & verification</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={smsConfig.autoDispatchWithTracking}
                    onChange={(e) =>
                      setSmsConfig((p) => ({ ...p, autoDispatchWithTracking: e.target.checked }))
                    }
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Send courier tracking link SMS when parcel is handed over</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={smsConfig.autoDeliveryReviewPrompt}
                    onChange={(e) =>
                      setSmsConfig((p) => ({ ...p, autoDeliveryReviewPrompt: e.target.checked }))
                    }
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Send review prompt SMS after courier delivery is confirmed</span>
                </label>
              </div>

              {/* Template Editor */}
              <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-900 text-xs">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                  <span>Order confirmation SMS template</span>
                  <span className="text-[10px] text-zinc-400 font-mono tabular-nums">
                    {smsConfig.orderTemplate.length} chars (1 SMS)
                  </span>
                </h4>

                <textarea
                  value={smsConfig.orderTemplate}
                  onChange={(e) =>
                    setSmsConfig((p) => ({ ...p, orderTemplate: e.target.value }))
                  }
                  rows={3}
                  className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs font-mono text-zinc-800 dark:text-zinc-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-zinc-400">Available tags:</span>
                  {["{{customer_name}}", "{{order_id}}", "{{total_amount}}", "{{courier}}", "{{tracking_code}}"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 select-all"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Test Console & Wallet (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Live SMS dispatch simulator</span>
              </h3>

              <p className="text-xs text-zinc-500 text-pretty">
                Test sending a real-time transaction notification to any phone number to verify masking and latency.
              </p>

              {smsNotice && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{smsNotice}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">
                    Recipient phone number (Bangladesh)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs">
                      +88
                    </span>
                    <Input
                      type="text"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="pl-12 text-xs font-mono h-9 tabular-nums"
                    />
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={handleSendTestSMS}
                  disabled={isSendingSMS || !testPhone}
                  className="w-full gap-2 shadow-2xs h-9"
                >
                  <Send className={`w-3.5 h-3.5 ${isSendingSMS ? "animate-spin" : ""}`} />
                  <span>{isSendingSMS ? "Transmitting SMS..." : "Send test SMS"}</span>
                </Button>
              </div>

              {/* Masking Preview */}
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 text-xs space-y-1">
                <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                  <span>Masking header: {smsConfig.senderId}</span>
                  <Badge variant="outline" className="text-[9px] font-mono">BTRC Approved</Badge>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono">
                  Delivers as "{smsConfig.senderId}" on GP, Banglalink, Robi & Teletalk SIM cards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GMAIL & SMTP TRANSACTIONAL EMAIL */}
      {activeTab === "email" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-150">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>Gmail SMTP & transactional settings</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">
                    Email service provider
                  </label>
                  <select
                    value={emailConfig.provider}
                    onChange={(e) =>
                      setEmailConfig((p) => ({ ...p, provider: e.target.value as any }))
                    }
                    className="w-full h-9 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="gmail">Gmail SMTP (OAuth2 / App Password)</option>
                    <option value="resend">Resend API</option>
                    <option value="sendgrid">Twilio SendGrid</option>
                    <option value="smtp">Custom SMTP Server</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 font-medium mb-1">
                    SMTP server host
                  </label>
                  <Input
                    type="text"
                    value={emailConfig.smtpHost}
                    onChange={(e) => setEmailConfig((p) => ({ ...p, smtpHost: e.target.value }))}
                    className="text-xs font-mono h-9"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 font-medium mb-1">
                    SMTP port
                  </label>
                  <Input
                    type="number"
                    value={emailConfig.smtpPort}
                    onChange={(e) => setEmailConfig((p) => ({ ...p, smtpPort: Number(e.target.value) }))}
                    className="text-xs font-mono h-9 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 font-medium mb-1">
                    From email address
                  </label>
                  <Input
                    type="email"
                    value={emailConfig.senderEmail}
                    onChange={(e) => setEmailConfig((p) => ({ ...p, senderEmail: e.target.value }))}
                    className="text-xs font-mono h-9"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-500 font-medium mb-1">
                    Sender display name
                  </label>
                  <Input
                    type="text"
                    value={emailConfig.senderName}
                    onChange={(e) => setEmailConfig((p) => ({ ...p, senderName: e.target.value }))}
                    className="text-xs h-9"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-500 font-medium mb-1">
                    Gmail app password (16-character secure token)
                  </label>
                  <Input
                    type="password"
                    value={emailConfig.smtpPassMasked}
                    onChange={(e) => setEmailConfig((p) => ({ ...p, smtpPassMasked: e.target.value }))}
                    className="text-xs font-mono h-9"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-900 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={emailConfig.enableInvoiceEmail}
                    onChange={(e) =>
                      setEmailConfig((p) => ({ ...p, enableInvoiceEmail: e.target.checked }))
                    }
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Attach invoice PDF to order confirmation email</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={emailConfig.enableDispatchEmail}
                    onChange={(e) =>
                      setEmailConfig((p) => ({ ...p, enableDispatchEmail: e.target.checked }))
                    }
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Send shipping notification with courier parcel tracking link</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={emailConfig.enableVipPatronWelcome}
                    onChange={(e) =>
                      setEmailConfig((p) => ({ ...p, enableVipPatronWelcome: e.target.checked }))
                    }
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Send welcome email upon attaining Gold or VIP tier</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Test Email & HTML Template Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <Send className="w-4 h-4 text-blue-500" />
                <span>Test Gmail SMTP connection</span>
              </h3>

              {emailNotice && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{emailNotice}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">
                    Send test invoice email to
                  </label>
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="text-xs font-mono h-9"
                  />
                </div>

                <Button
                  size="sm"
                  onClick={handleSendTestEmail}
                  disabled={isSendingEmail || !testEmail}
                  className="w-full gap-2 shadow-2xs h-9"
                >
                  <Mail className={`w-3.5 h-3.5 ${isSendingEmail ? "animate-spin" : ""}`} />
                  <span>{isSendingEmail ? "Transmitting via Gmail..." : "Send test email invoice"}</span>
                </Button>
              </div>

              {/* Preview Box */}
              <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 text-xs space-y-2 border border-zinc-800">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>Subject: Your Order #ORD-2026-0891 Confirmed</span>
                  <Badge variant="outline" className="text-[9px] text-zinc-300">HTML</Badge>
                </div>
                <div className="text-[11px] space-y-1 text-zinc-300">
                  <p className="font-semibold text-white">INSPIRE LIFESTYLE ATELIER</p>
                  <p>Thank you for choosing bespoke excellence. Your order has been registered.</p>
                  <p className="text-zinc-400 font-mono text-[10px]">Estimated Delivery: 24–48 Hours via Steadfast Express</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER OTP & FRAUD SHIELD */}
      {activeTab === "otp" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-150">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Checkout OTP & fraud rules</span>
              </h3>

              <div className="space-y-4 text-xs">
                {/* Main Enforce Toggles */}
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                        Mandatory OTP on cash on delivery (COD)
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Customers must verify their mobile number with an SMS OTP before placing a COD order. Eliminates fake deliveries & returned parcels.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={otpRules.mandatoryForCOD}
                      onChange={(e) =>
                        setOtpRules((p) => ({ ...p, mandatoryForCOD: e.target.checked }))
                      }
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-500 font-medium mb-1">
                      OTP length
                    </label>
                    <select
                      value={otpRules.otpLength}
                      onChange={(e) =>
                        setOtpRules((p) => ({ ...p, otpLength: Number(e.target.value) as any }))
                      }
                      className="w-full h-9 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-semibold"
                    >
                      <option value={6}>6 digits (Recommended for security)</option>
                      <option value={4}>4 digits (Faster checkout)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-500 font-medium mb-1">
                      OTP expiry window
                    </label>
                    <select
                      value={otpRules.expiryMinutes}
                      onChange={(e) =>
                        setOtpRules((p) => ({ ...p, expiryMinutes: Number(e.target.value) }))
                      }
                      className="w-full h-9 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-semibold"
                    >
                      <option value={2}>2 minutes (Strict)</option>
                      <option value={5}>5 minutes (Standard)</option>
                      <option value={10}>10 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-500 font-medium mb-1">
                      Verification channels
                    </label>
                    <select
                      value={otpRules.channels}
                      onChange={(e) =>
                        setOtpRules((p) => ({ ...p, channels: e.target.value as any }))
                      }
                      className="w-full h-9 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-semibold"
                    >
                      <option value="sms">Mobile SMS only</option>
                      <option value="email">Gmail / Email only</option>
                      <option value="both">Both SMS & email OTP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-500 font-medium mb-1">
                      High-value COD threshold (৳)
                    </label>
                    <Input
                      type="number"
                      value={otpRules.codThresholdBDT}
                      onChange={(e) =>
                        setOtpRules((p) => ({ ...p, codThresholdBDT: Number(e.target.value) }))
                      }
                      className="text-xs font-mono h-9 tabular-nums"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                    Fraud prevention and rate limiting
                  </span>
                  <p className="text-zinc-500 text-[11px] tabular-nums">
                    After {otpRules.maxAttempts} invalid OTP attempts from the same IP address or phone number, temporary lockout is triggered for {otpRules.lockoutMinutes} minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive OTP Test Simulator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <KeyRound className="w-4 h-4 text-indigo-500" />
                <span>Live OTP simulator</span>
              </h3>

              <p className="text-xs text-zinc-500 text-pretty">
                Simulate the real-time customer OTP experience during checkout or login to test verification logic.
              </p>

              <Button
                size="sm"
                onClick={handleGenerateSimulatedOTP}
                className="w-full gap-2 shadow-2xs h-9"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Generate test OTP</span>
              </Button>

              {simulatedOTP && (
                <div className="p-4 rounded-xl border border-indigo-200/60 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                      Simulated SMS received:
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px] tabular-nums">
                      Expires in 1:59s
                    </Badge>
                  </div>

                  <div className="text-center py-2">
                    <div className="text-3xl font-extrabold font-mono tracking-widest text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {simulatedOTP}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-indigo-200/40 dark:border-indigo-900/40">
                    <label className="block text-[11px] text-zinc-500">
                      Verify customer input:
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        maxLength={6}
                        value={testInputOTP}
                        onChange={(e) => setTestInputOTP(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="text-xs font-mono text-center tracking-widest h-9 tabular-nums"
                      />
                      <Button size="sm" onClick={handleVerifySimulatedOTP} className="h-9 px-4">
                        Verify
                      </Button>
                    </div>
                  </div>

                  {otpVerifyResult === "success" && (
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>OTP verified! Checkout authorized.</span>
                    </div>
                  )}

                  {otpVerifyResult === "fail" && (
                    <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span>Invalid OTP code. Please try again.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE DISPATCH AUDIT LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <Input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search recipient phone, email, snippet..."
                className="pl-8 text-xs h-9"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={logChannelFilter}
                onChange={(e) => setLogChannelFilter(e.target.value)}
                className="h-9 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                <option value="all">All channels</option>
                <option value="sms">Mobile SMS</option>
                <option value="gmail">Gmail SMTP</option>
                <option value="otp">SMS OTP</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[18%]">Timestamp</TableHead>
                  <TableHead className="w-[14%]">Channel</TableHead>
                  <TableHead className="w-[20%]">Recipient & Customer</TableHead>
                  <TableHead>Message Snippet</TableHead>
                  <TableHead className="w-[14%]">Gateway Response</TableHead>
                  <TableHead className="text-center w-[10%]">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-zinc-500 text-[11px] whitespace-nowrap tabular-nums">
                      {log.timestamp}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          log.channel === "SMS OTP"
                            ? "border-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-950/40"
                            : log.channel === "Gmail SMTP"
                            ? "border-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-950/40"
                            : "border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                        }`}
                      >
                        {log.channel}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {log.recipient}
                      </div>
                      <div className="text-[11px] text-zinc-400">{log.recipientName}</div>
                    </TableCell>

                    <TableCell className="max-w-sm">
                      <p className="truncate text-zinc-600 dark:text-zinc-300">
                        {log.contentSnippet}
                      </p>
                    </TableCell>

                    <TableCell className="font-mono text-[10px] text-zinc-400">
                      {log.gatewayResponse}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={log.status === "Delivered" || log.status === "Verified" ? "success" : "default"}
                        className="text-[10px]"
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
