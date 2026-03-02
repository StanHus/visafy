"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n-context";

interface PropertyItem {
  id: string;
  title: string;
  city: string;
  priceMonthly: number;
  rooms: number | null;
  status: string;
  createdAt: string;
}

interface InquiryItem {
  id: string;
  propertyTitle: string;
  propertyCity: string;
  tenantName: string;
  landlordName: string;
  message: string;
  status: string;
  createdAt: string;
}

interface ConvoMessage {
  id: string;
  message: string;
  senderId: string;
  senderName: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-accent-100 text-accent-700",
  rented: "bg-brand-50 text-brand-700",
  inactive: "bg-gray-100 text-gray-500",
  new: "bg-orange-100 text-orange-700",
  replied: "bg-brand-50 text-brand-700",
  closed: "bg-gray-100 text-gray-500",
};

export default function RentalsDashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const rt = t.rentals;

  const [tab, setTab] = useState<"listings" | "inquiries">("listings");
  const [listings, setListings] = useState<PropertyItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Inquiry conversation
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConvoMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/signin");
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    Promise.all([
      fetch("/api/properties").then((r) => r.json()),
      fetch("/api/inquiries").then((r) => r.json()),
    ]).then(([p, i]) => {
      // Filter own properties
      const myProps = (Array.isArray(p) ? p : []).filter(
        (prop: PropertyItem & { landlordId?: string }) =>
          prop.landlordId === session?.user?.id
      );
      setListings(myProps);
      setInquiries(Array.isArray(i) ? i : []);
      setLoading(false);
    });
  }, [authStatus, session?.user?.id]);

  const openInquiry = async (inquiryId: string) => {
    setSelectedInquiry(inquiryId);
    const res = await fetch(`/api/inquiries/${inquiryId}/messages`);
    if (res.ok) setMessages(await res.json());
  };

  const sendReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return;
    setSendingReply(true);
    const res = await fetch(`/api/inquiries/${selectedInquiry}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: replyText }),
    });
    if (res.ok) {
      setReplyText("");
      // Refresh messages
      const msgsRes = await fetch(
        `/api/inquiries/${selectedInquiry}/messages`
      );
      if (msgsRes.ok) setMessages(await msgsRes.json());
    }
    setSendingReply(false);
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {rt.dashboard}
            </h1>
            <Link href="/rentals/list">
              <Button size="sm">{rt.listProperty}</Button>
            </Link>
          </div>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={50}>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
            {(["listings", "inquiries"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  tab === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "listings" ? rt.myListings : rt.myInquiries}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Listings Tab */}
        {tab === "listings" && (
          <FadeIn delay={100}>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {listings.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  {rt.noListings}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {listings.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/rentals/${prop.id}`}
                          className="font-medium text-gray-900 hover:text-brand-600 transition-colors"
                        >
                          {prop.title}
                        </Link>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span>{prop.city}</span>
                          <span>
                            €{(prop.priceMonthly / 100).toFixed(0)}
                            {rt.perMonth}
                          </span>
                          {prop.rooms !== null && (
                            <span>
                              {prop.rooms} {rt.rooms}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          STATUS_COLORS[prop.status] || "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {rt[prop.status as keyof typeof rt] as string || prop.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* Inquiries Tab */}
        {tab === "inquiries" && (
          <FadeIn delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inquiry List */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {inquiries.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    {rt.noInquiries}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {inquiries.map((inq) => (
                      <button
                        key={inq.id}
                        onClick={() => openInquiry(inq.id)}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          selectedInquiry === inq.id ? "bg-brand-50" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-gray-900">
                            {inq.propertyTitle}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              STATUS_COLORS[inq.status] ||
                              "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {rt.inquiryStatus[inq.status as keyof typeof rt.inquiryStatus] || inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {inq.tenantName} &middot;{" "}
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                          {inq.message}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Conversation */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                {selectedInquiry ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            msg.senderId === session?.user?.id
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <span className="text-xs text-gray-400 mb-0.5">
                            {msg.senderName}
                          </span>
                          <div
                            className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                              msg.senderId === session?.user?.id
                                ? "bg-brand-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {msg.message}
                          </div>
                          <span className="text-xs text-gray-300 mt-0.5">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 p-3 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={rt.replyPlaceholder}
                        onKeyDown={(e) => e.key === "Enter" && sendReply()}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <Button
                        size="sm"
                        onClick={sendReply}
                        loading={sendingReply}
                      >
                        {rt.send}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-gray-400 flex-1 flex items-center justify-center">
                    {rt.noInquiries}
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
