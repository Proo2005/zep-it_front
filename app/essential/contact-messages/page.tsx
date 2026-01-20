"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiMail, FiUser, FiClock, FiTag } from "react-icons/fi";

type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("https://zep-it-back.onrender.com/api/contact/all");
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch contact messages", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GROUP BY SUBJECT (CATEGORY)
  const groupedMessages = messages.reduce((acc: any, msg) => {
    const key = msg.subject || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  if (loading) {
    return (
      <p className="text-center mt-24 text-gray-500 text-lg">
        Loading messages...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>

      {messages.length === 0 && (
        <p className="text-gray-500">No messages found.</p>
      )}

      <div className="space-y-10">
        {Object.keys(groupedMessages).map((subject) => (
          <div key={subject}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiTag className="text-[#0C831F]" />
              {subject}
              <span className="text-sm text-gray-500">
                ({groupedMessages[subject].length})
              </span>
            </h2>

            <div className="grid gap-4">
              {groupedMessages[subject].map((msg: ContactMessage) => (
                <MessageCard key={msg._id} message={msg} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- MESSAGE CARD ---------------- */

function MessageCard({ message }: { message: ContactMessage }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {message.name}
          </h3>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <FiMail /> {message.email}
            </span>
            <span className="flex items-center gap-1">
              <FiClock />
              {new Date(message.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700 font-semibold">
          {message.subject}
        </span>
      </div>

      <p className="mt-4 text-gray-700 text-sm leading-relaxed">
        {message.message}
      </p>
    </div>
  );
}
