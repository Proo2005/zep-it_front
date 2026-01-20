"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { useRouter } from "next/navigation";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "Issue",
    message: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      /* 1️⃣ SEND EMAIL */
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
          to_email: "prochak1922@gmail.com",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
      );

      /* 2️⃣ SAVE TO DATABASE */
      await axios.post("https://zep-it-back.onrender.com/api/contact/add", form);

      setSuccess("Your message has been sent successfully.");
      setForm({
        name: "",
        email: "",
        subject: "Issue",
        message: "",
      });
      router.push("/");
      
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-black">Contact Us</h1>
        <p className="text-gray-600 mb-6 ">
          Share your issues, feedback, or suggestions with us.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-gray-600">
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="Issue">Issue</option>
            <option value="Feedback">Feedback</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="message"
            required
            placeholder="Write your message..."
            value={form.message}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded-xl px-4 py-3 resize-none"
          />

          <button
            disabled={loading}
            className="w-full bg-[#0C831F] text-white py-3 rounded-xl font-semibold hover:bg-[#0A6E1A] transition disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
