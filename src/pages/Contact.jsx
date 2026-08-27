import { useState } from "react";
import axios from "axios";

import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";

export default function Contact() {
  const bgRef = useParallax(-0.12);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:5000/send-message", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      alert("Unable to send your message. Please try again.");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Unable to connect to the server.");
  }
}


  return (
    <div>
      <section className="relative bg-ink grain overflow-hidden pt-40 pb-20">
        <div
          ref={bgRef}
          data-parallax
          className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle, #3E5FE0, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className="font-mono-label text-[14px] text-signal mb-6">Contact</p>
          <h1 className="font-display text-paper text-4xl md:text-6xl font-semibold leading-tight">
            Tell us what you're building.
          </h1>
          <p className="text-mist text-lg mt-6 max-w-2xl leading-relaxed">
            A few lines about the problem is enough to start. We reply within
            one working day.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <Reveal>
              <p className="font-mono-label text-[14px] text-signal-dim mb-4">Reach us directly</p>
              <ul className="space-y-6">
                <li>
                  <p className="font-mono-label text-[12px] text-graphite mb-1">Email</p>
                  <a href="mailto:hello@axonite.in" className="font-display text-xl font-semibold hover:text-signal-dim">
                    info@axonite.in
                  </a>
                </li>
                <li>
                  <p className="font-mono-label text-[12px] text-graphite mb-1">Phone</p>
                  <a href="tel:+91" className="font-display text-xl font-semibold hover:text-signal-dim">
                    +91 9823103626
                  </a>
                </li>
                <li>
                  <p className="font-mono-label text-[12px] text-graphite mb-1">Office</p>
                  <p className="font-display text-xl font-semibold">
                    Pune, Maharashtra, India
                  </p>
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="md:col-span-3">
            <Reveal delay={100}>
              {submitted ? (
                <div className="bg-white border border-signal rounded-2xl p-10 text-center">
                  <h2 className="font-display text-2xl font-semibold mb-3">
                    Message sent.
                  </h2>
                  <p className="text-graphite">
                    Thanks for writing in — we'll get back to you within one
                    working day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-line-soft rounded-2xl p-8 space-y-5">
                  <div className="grid md:grid-cols-2 gap-5 ">
                    <Field label="Name" id="name" 
                    name="name"
                    type="text" required  />
                    <Field label="Work email" id="email" name="email" type="email" required />
                  </div>
                  <Field label="Company" id="company" name="company" type="text" 
                  />
                  <div>
                    <label htmlFor="message" className="font-mono-label text-[12px] text-graphite block mb-2">
                      Project details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="What are you looking to build or fix?"
                      className="w-full border border-line-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full md:w-auto inline-flex justify-center bg-ink text-paper font-mono-label text-[11px] px-7 py-3.5 rounded-full hover:bg-signal hover:text-white transition-colors"
                  >
                    Send message
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, id, name, type, required }) {
  return (
    <div>
      <label htmlFor={id} className="font-mono-label text-[12px] text-graphite block mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        className="w-full border border-line-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors"
      />
    </div>
  );
}
