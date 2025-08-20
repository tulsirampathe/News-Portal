// src/components/ContactForm.jsx
import React from "react";

const ContactForm = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-bold mb-4">Contact Us</h3>
      <form className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <textarea
          rows="3"
          placeholder="Your Message"
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
