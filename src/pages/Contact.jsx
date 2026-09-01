import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";

export default function Contact() {
  const bgRef = useParallax(-0.12);

  // -----------------------------------
  // Step
  // 1 = Contact form
  // 2 = Cloudflare verification
  // -----------------------------------

  const [step, setStep] = useState(1);

  // -----------------------------------
  // Form state
  // -----------------------------------

  const [form, setForm] = useState({
    username: "",
    workEmail: "",
    companyName: "",
    description: "",
  });

  // -----------------------------------
  // Error state
  // -----------------------------------

  const [errors, setErrors] = useState({});

  // -----------------------------------
  // Turnstile state
  // -----------------------------------

  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const [verificationSuccessful, setVerificationSuccessful] =
    useState(false);

  // -----------------------------------
  // Loading / success
  // -----------------------------------

  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // -----------------------------------
  // Handle input changes
  // -----------------------------------

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove field error while typing
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  }

  // -----------------------------------
  // Step 1
  // Validate contact form
  // -----------------------------------

  function handleSubmit(e) {
    e.preventDefault();

    // Clear old errors
    setErrors({});
    setTurnstileError("");
    setVerificationSuccessful(false);

    // -----------------------------------
    // Clean values
    // -----------------------------------

    const username = form.username.trim();
    const workEmail = form.workEmail.trim();
    const companyName = form.companyName.trim();
    const description = form.description.trim();

    // -----------------------------------
    // Name validation
    // -----------------------------------

    if (!username) {
      setErrors({
        username: "Please enter your name.",
      });

      return;
    }

    if (username.length > 100) {
      setErrors({
        username:
          "Name cannot be longer than 100 characters.",
      });

      return;
    }

    // -----------------------------------
    // Email validation
    // -----------------------------------

    if (!workEmail) {
      setErrors({
        workEmail: "Please enter your work email.",
      });

      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(workEmail)) {
      setErrors({
        workEmail:
          "Please enter a valid work email.",
      });

      return;
    }

    // -----------------------------------
    // Company validation
    // -----------------------------------

    if (!companyName) {
      setErrors({
        companyName:
          "Please enter your company name.",
      });

      return;
    }

    if (companyName.length > 200) {
      setErrors({
        companyName:
          "Company name cannot be longer than 200 characters.",
      });

      return;
    }

    // -----------------------------------
    // Description validation
    // -----------------------------------

    if (!description) {
      setErrors({
        description:
          "Please enter your project details.",
      });

      return;
    }

    if (description.length > 5000) {
      setErrors({
        description:
          "Project details cannot be longer than 5000 characters.",
      });

      return;
    }

    // -----------------------------------
    // Save cleaned values
    // -----------------------------------

    setForm({
      username,
      workEmail,
      companyName,
      description,
    });

    // -----------------------------------
    // Move to Cloudflare step
    // -----------------------------------

    setStep(2);
  }

  // -----------------------------------
  // Step 2
  // Cloudflare verification successful
  // -----------------------------------

  async function handleTurnstileSuccess(token) {
    setTurnstileToken(token);

    setTurnstileError("");

    setVerificationSuccessful(true);

    // -----------------------------------
    // Prevent duplicate request
    // -----------------------------------

    if (processing) {
      return;
    }

    setProcessing(true);

    // -----------------------------------
    // Send data to backend
    // -----------------------------------

    try {
      const response = await fetch(
        "http://localhost:5000/api/contact",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: form.username,
            workEmail: form.workEmail,
            companyName: form.companyName,
            description: form.description,

            // Cloudflare token
            turnstileToken: token,
          }),
        }
      );

      const data = await response.json();

      // -----------------------------------
      // Backend error
      // -----------------------------------

      if (!response.ok) {
        // -----------------------------------
        // Cloudflare error
        // -----------------------------------

        if (data.field === "turnstile") {
          setTurnstileError(
            data.message ||
              "Security verification failed. Please try again."
          );

          setTurnstileToken("");

          setVerificationSuccessful(false);

          return;
        }

        // -----------------------------------
        // Normal field error
        // -----------------------------------

        if (data.field) {
          setErrors({
            [data.field]:
              data.message ||
              "Please check this field.",
          });

          setStep(1);

          return;
        }

        // -----------------------------------
        // General error
        // -----------------------------------

        setTurnstileError(
          data.message ||
            "Unable to send your message. Please try again."
        );

        setVerificationSuccessful(false);

        return;
      }

      // -----------------------------------
      // Success
      // -----------------------------------

      if (data.success) {
        setSubmitted(true);

        setErrors({});

        setTurnstileError("");

        setTurnstileToken("");

        setVerificationSuccessful(false);

        setForm({
          username: "",
          workEmail: "",
          companyName: "",
          description: "",
        });
      }
    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      setTurnstileError(
        "Unable to connect to the server. Please try again."
      );

      setVerificationSuccessful(false);
    } finally {
      setProcessing(false);
    }
  }

  // -----------------------------------
  // Cloudflare error
  // -----------------------------------

  function handleTurnstileError() {
    setTurnstileToken("");

    setVerificationSuccessful(false);

    setTurnstileError(
      "Security verification failed. Please try again."
    );

    setProcessing(false);
  }

  // -----------------------------------
  // Cloudflare expired
  // -----------------------------------

  function handleTurnstileExpire() {
    setTurnstileToken("");

    setVerificationSuccessful(false);

    setTurnstileError(
      "Security verification expired. Please try again."
    );

    setProcessing(false);
  }

  // -----------------------------------
  // Go back to form
  // -----------------------------------

  function handleBack() {
    setStep(1);

    setTurnstileToken("");

    setTurnstileError("");

    setVerificationSuccessful(false);

    setProcessing(false);
  }

  // -----------------------------------
  // SUCCESS SCREEN
  // -----------------------------------

  if (submitted) {
    return (
      <div>
        <section className="relative bg-ink grain overflow-hidden pt-40 pb-20">
          <div
            ref={bgRef}
            data-parallax
            className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-[0.14]"
            style={{
              background:
                "radial-gradient(circle, #3E5FE0, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-4xl mx-auto px-6">
            <p className="font-mono-label text-[14px] text-signal mb-6">
              Contact
            </p>

            <h1 className="font-display text-paper text-4xl md:text-6xl font-semibold leading-tight">
              Thank you.
            </h1>

            <p className="text-mist text-lg mt-6 max-w-2xl leading-relaxed">
              Your message has been successfully sent.
            </p>
          </div>
        </section>

        <section className="bg-paper py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white border border-signal rounded-2xl p-10 text-center">

                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>

                <h2 className="font-display text-2xl font-semibold mb-3">
                  Message sent.
                </h2>

                <p className="text-graphite">
                  Thanks for writing in — we'll get back
                  to you within one working day.
                </p>

              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>

      {/* ================================= */}
      {/* HERO SECTION */}
      {/* ================================= */}

      <section className="relative bg-ink grain overflow-hidden pt-40 pb-20">

        <div
          ref={bgRef}
          data-parallax
          className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-[0.14]"
          style={{
            background:
              "radial-gradient(circle, #3E5FE0, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-6">

          <p className="font-mono-label text-[14px] text-signal mb-6">
            Contact
          </p>

          <h1 className="font-display text-paper text-4xl md:text-6xl font-semibold leading-tight">
            Tell us what you're building.
          </h1>

          <p className="text-mist text-lg mt-6 max-w-2xl leading-relaxed">
            A few lines about the problem is enough to start.
            We reply within one working day.
          </p>

        </div>
      </section>

      {/* ================================= */}
      {/* CONTACT SECTION */}
      {/* ================================= */}

      <section className="bg-paper py-20">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-5 gap-12">

          {/* ================================= */}
          {/* CONTACT INFORMATION */}
          {/* ================================= */}

          <div className="md:col-span-2">

            <Reveal>

              <p className="font-mono-label text-[14px] text-signal-dim mb-4">
                Reach us directly
              </p>

              <ul className="space-y-6">

                <li>
                  <p className="font-mono-label text-[12px] text-graphite mb-1">
                    Email
                  </p>

                  <a
                    href="mailto:info@axonite.net"
                    className="font-display text-xl font-semibold hover:text-signal-dim"
                  >
                    info@axonite.net
                  </a>
                </li>

                <li>
                  <p className="font-mono-label text-[12px] text-graphite mb-1">
                    Phone
                  </p>

                  <a
                    href="tel:+919823103626"
                    className="font-display text-xl font-semibold hover:text-signal-dim"
                  >
                    +91 9823103626
                  </a>
                </li>

                <li>
                  <p className="font-mono-label text-[12px] text-graphite mb-1">
                    Office
                  </p>

                  <p className="font-display text-xl font-semibold">
                    Pune, Maharashtra, India
                  </p>
                </li>

              </ul>

            </Reveal>

          </div>

          {/* ================================= */}
          {/* FORM / VERIFICATION */}
          {/* ================================= */}

          <div className="md:col-span-3">

            <Reveal delay={100}>

              {/* ================================= */}
              {/* STEP 1 — CONTACT FORM */}
              {/* ================================= */}

              {step === 1 && (

                <form
                  onSubmit={handleSubmit}
                  className="bg-white border border-line-soft rounded-2xl p-8 space-y-5"
                >

                  <div className="mb-2">

                    <p className="font-mono-label text-[12px] text-signal-dim">
                      Step 1 of 2
                    </p>

                    <h2 className="font-display text-2xl font-semibold mt-2">
                      Your information
                    </h2>

                  </div>

                  {/* NAME + EMAIL */}

                  <div className="grid md:grid-cols-2 gap-5">

                    <Field
                      label="Name"
                      id="username"
                      name="username"
                      type="text"
                      value={form.username}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      error={errors.username}
                    />

                    <Field
                      label="Work email"
                      id="workEmail"
                      name="workEmail"
                      type="email"
                      value={form.workEmail}
                      onChange={handleChange}
                      required
                      error={errors.workEmail}
                    />

                  </div>

                  {/* COMPANY */}

                  <Field
                    label="Company"
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={form.companyName}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    error={errors.companyName}
                  />

                  {/* DESCRIPTION */}

                  <div>

                    <label
                      htmlFor="description"
                      className="font-mono-label text-[12px] text-graphite block mb-2"
                    >
                      Project details
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      maxLength={5000}
                      placeholder="What are you looking to build or fix?"
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors resize-none ${
                        errors.description
                          ? "border-red-500"
                          : "border-line-soft"
                      }`}
                    />

                    <div className="flex justify-between items-start mt-1">

                      {errors.description ? (
                        <p className="text-red-500 text-xs">
                          {errors.description}
                        </p>
                      ) : (
                        <span />
                      )}

                      <p className="text-xs text-graphite">
                        Maximum 5000 characters
                      </p>

                    </div>

                  </div>

                  {/* GENERAL ERROR */}

                  {errors.general && (
                    <p className="text-red-500 text-sm">
                      {errors.general}
                    </p>
                  )}

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="w-full md:w-auto inline-flex justify-center bg-ink text-paper font-mono-label text-[11px] px-7 py-3.5 rounded-full hover:bg-signal hover:text-white transition-colors"
                  >
                    Continue
                  </button>

                </form>

              )}

              {/* ================================= */}
              {/* STEP 2 — CLOUDFLARE */}
              {/* ================================= */}

              {step === 2 && (

                <div className="bg-white border border-line-soft rounded-2xl p-8 space-y-5">

                  <div>

                    <p className="font-mono-label text-[12px] text-signal-dim">
                      Step 2 of 2
                    </p>

                    <h2 className="font-display text-2xl font-semibold mt-2">
                      Security verification
                    </h2>

                    <p className="text-graphite mt-3">
                      Please complete the Cloudflare verification
                      to send your message.
                    </p>

                  </div>

                  {/* ================================= */}
                  {/* TURNSTILE */}
                  {/* ================================= */}

                  <div className="py-2">

                    <Turnstile
                      siteKey={
                        import.meta.env
                          .VITE_CLOUDFLARE_TURNSTILE_SITE_KEY
                      }

                      onSuccess={
                        handleTurnstileSuccess
                      }

                      onError={
                        handleTurnstileError
                      }

                      onExpire={
                        handleTurnstileExpire
                      }

                      options={{
                        theme: "light",
                      }}
                    />

                  </div>

                  {/* ================================= */}
                  {/* VERIFICATION SUCCESS */}
                  {/* ================================= */}

                  {verificationSuccessful && (

                    <p className="text-green-600 text-sm">
                      ✓ Security verification successful.
                    </p>

                  )}

                  {/* ================================= */}
                  {/* CLOUDFLARE ERROR */}
                  {/* ================================= */}

                  {turnstileError && (

                    <p className="text-red-500 text-sm">
                      {turnstileError}
                    </p>

                  )}

                  {/* ================================= */}
                  {/* PROCESSING */}
                  {/* ================================= */}

                  {processing && (

                    <p className="text-sm text-graphite">
                      {verificationSuccessful
                        ? "Sending your message..."
                        : "Processing verification..."}
                    </p>

                  )}

                  {/* ================================= */}
                  {/* BUTTONS */}
                  {/* ================================= */}

                  <div className="flex flex-col sm:flex-row gap-3">

                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={processing}
                      className="w-full sm:w-auto inline-flex justify-center border border-line-soft text-ink font-mono-label text-[11px] px-7 py-3.5 rounded-full hover:bg-paper transition-colors disabled:opacity-50"
                    >
                      ← Back
                    </button>

                  </div>

                </div>

              )}

            </Reveal>

          </div>

        </div>

      </section>

    </div>
  );
}

/* ================================= */
/* FIELD COMPONENT */
/* ================================= */

function Field({
  label,
  id,
  name,
  type,
  value,
  onChange,
  required,
  maxLength,
  error,
}) {
  return (
    <div>

      <label
        htmlFor={id}
        className="font-mono-label text-[12px] text-graphite block mb-2"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors ${
          error
            ? "border-red-500"
            : "border-line-soft"
        }`}
      />

      {error && (

        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>

      )}

    </div>
  );
}
