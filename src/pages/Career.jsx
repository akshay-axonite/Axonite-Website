
import { useState } from "react";
import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";
import { getJobs } from "../lib/store";

/*
|--------------------------------------------------------------------------
| CAREER PAGE - PERKS
|--------------------------------------------------------------------------
*/

const perks = [
  {
    label: "Health cover",
    desc: "For you and your immediate family, from day one.",
  },
  {
    label: "Flexible hours",
    desc: "Core overlap hours, otherwise work when you're sharpest.",
  },
  {
    label: "Learning budget",
    desc: "Courses, books, and conferences — no approval theatre.",
  },
  {
    label: "Real ownership",
    desc: "You ship to production in your first two weeks.",
  },
];

/*
|--------------------------------------------------------------------------
| INITIAL FORM DATA
|--------------------------------------------------------------------------
*/

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  linkedin: "",
  qualification: "",
  experience: "",
  city: "",
  resume: null,
};

/*
|--------------------------------------------------------------------------
| INITIAL ERROR DATA
|--------------------------------------------------------------------------
*/

const initialErrors = {
  name: "",
  phone: "",
  email: "",
  linkedin: "",
  qualification: "",
  experience: "",
  city: "",
  resume: "",
};

/*
|--------------------------------------------------------------------------
| REGEX VALIDATIONS
|--------------------------------------------------------------------------
*/

// Name: only letters and spaces.
const nameRegex = /^[A-Za-z ]+$/;


// Gmail: valid Gmail address only.
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

// LinkedIn profile URL.
const linkedinRegex =
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9._-]+\/?$/;



// City: letters, spaces, dots and hyphens.
const cityRegex = /^[A-Za-z .-]+$/;

// Maximum resume size = 3 MB.
const MAX_RESUME_SIZE = 3 * 1024 * 1024;

export default function Career() {
  /*
  |--------------------------------------------------------------------------
  | CAREER PAGE DATA
  |--------------------------------------------------------------------------
  */

  // Background parallax effect.
  const bgRef = useParallax(-0.12);

  // Get available jobs.
  const [jobs] = useState(() => getJobs());

  /*
  |--------------------------------------------------------------------------
  | APPLICATION STATES
  |--------------------------------------------------------------------------
  */

  // Controls whether application modal is visible.
  const [showApplication, setShowApplication] = useState(false);

  // Current application step.
  //
  // 1 = Personal Information
  // 2 = Professional Information
  // 3 = Confirmation
  const [step, setStep] = useState(1);

  // Selected job.
  const [selectedJob, setSelectedJob] = useState(null);

  // Application form data.
  const [formData, setFormData] = useState(initialFormData);

  // Field validation errors.
  const [errors, setErrors] = useState(initialErrors);

  // Controls success screen.
  const [submitted, setSubmitted] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | HANDLE APPLY
  |--------------------------------------------------------------------------
  */

  const handleApply = (job) => {
    // Store selected job.
    setSelectedJob(job);

    // Clear previous form data.
    setFormData({ ...initialFormData });

    // Clear previous validation errors.
    setErrors({ ...initialErrors });

    // Start at step 1.
    setStep(1);

    // Reset submitted state.
    setSubmitted(false);

    // Open modal.
    setShowApplication(true);
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE APPLICATION
  |--------------------------------------------------------------------------
  */

  const closeApplication = () => {
    // Close modal.
    setShowApplication(false);

    // Reset step.
    setStep(1);

    // Remove selected job.
    setSelectedJob(null);

    // Clear form.
    setFormData({ ...initialFormData });

    // Clear errors.
    setErrors({ ...initialErrors });

    // Reset success state.
    setSubmitted(false);
  };

  /*
  |--------------------------------------------------------------------------
  | HANDLE INPUT CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Get selected file if input is file type.
    const newValue = files ? files[0] : value;

    // Update form data.
    setFormData((previousData) => ({
      ...previousData,
      [name]: newValue,
    }));

    // Clear error for the field when user starts correcting it.
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATE NAME
  |--------------------------------------------------------------------------
  */

  const validateName = () => {
    const value = formData.name.trim();

    if (!value) {
      return "Name is required.";
    }

    if (value.length > 100) {
      return "Name cannot be more than 100 characters.";
    }

    if (!nameRegex.test(value)) {
      return "Name can contain only letters and spaces.";
    }

    return "";
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATE PHONE
  |--------------------------------------------------------------------------
  */

 const validatePhone = () => {
  return "";
};

  /*
  |--------------------------------------------------------------------------
  | VALIDATE GMAIL
  |--------------------------------------------------------------------------
  */

  const validateEmail = () => {
    const value = formData.email.trim();

    if (!value) {
      return "Gmail address is required.";
    }

    if (!gmailRegex.test(value)) {
      return "Please enter a valid Gmail address, e.g. example@gmail.com.";
    }

    return "";
  };

  

  /*
  |--------------------------------------------------------------------------
  | VALIDATE QUALIFICATION
  |--------------------------------------------------------------------------
  */

  const validateQualification = () => {
    const value = formData.qualification.trim();

    if (!value) {
      return "Qualification is required.";
    }

    if (value.length > 100) {
      return "Qualification cannot be more than 100 characters.";
    }

   

    return "";
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATE EXPERIENCE
  |--------------------------------------------------------------------------
  */

  const validateExperience = () => {
    if (!formData.experience) {
      return "Please select your experience.";
    }

    return "";
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATE CITY
  |--------------------------------------------------------------------------
  */

  const validateCity = () => {
    const value = formData.city.trim();

    if (!value) {
      return "Residential city is required.";
    }

    if (value.length > 20) {
      return "City cannot be more than 20 characters.";
    }

    if (!cityRegex.test(value)) {
      return "City can contain only letters, spaces, dots and hyphens.";
    }

    return "";
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATE RESUME
  |--------------------------------------------------------------------------
  */

  const validateResume = () => {
    const file = formData.resume;

    if (!file) {
      return "Please upload your resume.";
    }

    // Check file extension.
    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".pdf")) {
      return "Only PDF files are allowed.";
    }

    // Check MIME type as an additional validation.
    if (file.type && file.type !== "application/pdf") {
      return "Only PDF files are allowed.";
    }

    // Check maximum size.
    if (file.size > MAX_RESUME_SIZE) {
      return "Resume size must not exceed 3 MB.";
    }

    return "";
  };

  /*
  |--------------------------------------------------------------------------
  | STEP 1 VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateStep1 = () => {
    const newErrors = {
      name: validateName(),
      phone:"",
      email: validateEmail(),
      linkedin: "",
    };

    setErrors((previousErrors) => ({
      ...previousErrors,
      ...newErrors,
    }));

    // Return true only when there are no errors.
    return !Object.values(newErrors).some((error) => error);
  };

  /*
  |--------------------------------------------------------------------------
  | STEP 2 VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateStep2 = () => {
    const newErrors = {
      qualification: "",
      experience: validateExperience(),
      city: validateCity(),
      resume: validateResume(),
    };

    setErrors((previousErrors) => ({
      ...previousErrors,
      ...newErrors,
    }));

    // Return true only when there are no errors.
    return !Object.values(newErrors).some((error) => error);
  };

  /*
  |--------------------------------------------------------------------------
  | STEP 1 CONTINUE
  |--------------------------------------------------------------------------
  */

  const handleStep1Continue = (e) => {
    e.preventDefault();

    // Validate all Step 1 fields.
    const isValid = validateStep1();

    // Stop if validation fails.
    if (!isValid) {
      return;
    }

    // Move to Step 2.
    setStep(2);

    // Scroll modal content to top.
    requestAnimationFrame(() => {
      document
        .getElementById("career-application-content")
        ?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
    });
  };

  /*
  |--------------------------------------------------------------------------
  | STEP 2 CONTINUE
  |--------------------------------------------------------------------------
  */

  const handleStep2Continue = (e) => {
    e.preventDefault();

    // Validate all Step 2 fields.
    const isValid = validateStep2();

    // Stop if validation fails.
    if (!isValid) {
      return;
    }

    // Move to confirmation.
    setStep(3);

    // Scroll modal content to top.
    requestAnimationFrame(() => {
      document
        .getElementById("career-application-content")
        ?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
    });
  };

  /*
  |--------------------------------------------------------------------------
  | FINAL SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (e) => {
    e.preventDefault();

    /*
    ----------------------------------------------------------------------
    | FINAL VALIDATION
    ----------------------------------------------------------------------
    */

    const step1Valid = validateStep1();
    const step2Valid = validateStep2();

    // Do not submit if anything is invalid.
    if (!step1Valid || !step2Valid) {
      return;
    }

    /*
    ----------------------------------------------------------------------
    | CURRENTLY FRONTEND ONLY
    ----------------------------------------------------------------------
    |
    | The application is currently logged in the browser console.
    |
    | To actually send the application + PDF resume to your company,
    | you will need a backend/API or email service.
    |
    */

    console.log("Application submitted:", {
      jobId: selectedJob?.id,
      jobTitle: selectedJob?.title,

      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      linkedin: formData.linkedin,

      qualification: formData.qualification,
      experience: formData.experience,
      city: formData.city,

      resume: formData.resume,
    });

    // Show Applied screen.
    setSubmitted(true);
  };

  return (
    <div>
      {/* =================================================================
          CAREER HERO
          ================================================================= */}

      <section className="relative bg-ink grain overflow-hidden pt-40 pb-24">
        <div
          ref={bgRef}
          data-parallax
          className="
            absolute
            -top-24
            left-1/4
            w-[480px]
            h-[480px]
            rounded-full
            opacity-[0.14]
          "
          style={{
            background:
              "radial-gradient(circle, #9B4FC9, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-6">
          <p className="font-mono-label text-[14px] text-signal mb-6">
            Career
          </p>

          <h1
            className="
              font-display
              text-paper
              text-4xl
              md:text-6xl
              font-semibold
              leading-tight
            "
          >
            Work on software people actually depend on.
          </h1>

          <p
            className="
              text-mist
              text-lg
              mt-6
              max-w-2xl
              leading-relaxed
            "
          >
            We're a small team in Pune building products that finance teams,
            field crews, and shift workers use every day. No growth-hacking,
            no vanity metrics — just software that has to work.
          </p>
        </div>
      </section>

      {/* =================================================================
          OPEN ROLES
          ================================================================= */}

      <section className="bg-paper py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="font-mono-label text-[14px] text-signal-dim mb-4">
              Open roles
            </p>

            <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-xl">
              {jobs.length > 0
                ? `Currently hiring for ${jobs.length} position${
                    jobs.length === 1 ? "" : "s"
                  }.`
                : "No open roles right now."}
            </h2>
          </Reveal>

          <div
            className="
              mt-12
              divide-y
              divide-line-soft
              border-t
              border-b
              border-line-soft
            "
          >
            {jobs.length === 0 && (
              <p className="py-8 text-sm text-graphite">
                Check back soon, or write to us anyway below.
              </p>
            )}

            {jobs.map((job, i) => (
              <Reveal key={job.id} delay={i * 80}>
                <div
                  className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    justify-between
                    gap-4
                    py-7
                  "
                >
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-semibold mb-1.5">
                      {job.title}
                    </h3>

                    <p className="text-graphite text-sm max-w-md leading-relaxed">
                      {job.desc}
                    </p>

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-4
                        mt-3
                        font-mono-label
                        text-[12px]
                        text-signal-dim
                      "
                    >
                      <span>{job.location}</span>
                      <span>{job.type}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApply(job)}
                    className="
                      shrink-0
                      inline-flex
                      items-center
                      justify-center
                      border
                      border-line-soft
                      rounded-full
                      px-5
                      py-2.5
                      font-mono-label
                      text-[14px]
                      hover:border-signal
                      hover:text-signal-dim
                      transition-colors
                    "
                  >
                    Apply
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          WHY JOIN
          ================================================================= */}

      <section className="bg-ink py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="font-mono-label text-[14px] text-signal mb-4">
              Why join
            </p>

            <h2
              className="
                font-display
                text-3xl
                md:text-4xl
                font-semibold
                text-paper
                max-w-xl
              "
            >
              What you get, beyond the paycheck.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-14">
            {perks.map((p, i) => (
              <Reveal key={p.label} delay={i * 100}>
                <div className="border-t-2 border-signal pt-5">
                  <h3 className="font-display text-paper text-lg font-semibold mb-2">
                    {p.label}
                  </h3>

                  <p className="text-mist text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          CONTACT SECTION
          ================================================================= */}

      <section className="bg-paper py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold">
              Don't see the right role listed?
            </h2>

            <p className="text-graphite mt-3">
              Write to us anyway at{" "}
              <a
                href="mailto:careers@axonite.in"
                className="text-signal-dim underline"
              >
                careers@axonite.in
              </a>
              . We keep every good resume on file.
            </p>
          </Reveal>
        </div>
      </section>

      {/* =================================================================
          APPLICATION MODAL
          ================================================================= */}

      {showApplication && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-3
            sm:p-4
          "
        >
          <div
            className="
              relative
              bg-paper
              w-full
              max-w-xl
              max-h-[92vh]
              rounded-2xl
              sm:rounded-3xl
              shadow-2xl
              border
              border-line-soft
              overflow-hidden
              flex
              flex-col
            "
          >
            {/* =========================================================
                HEADER
                ========================================================= */}

            <div
              className="
                relative
                px-5
                sm:px-7
                py-5
                sm:py-6
                border-b
                border-line-soft
                bg-paper
                shrink-0
              "
            >
              <p className="font-mono-label text-[10px] sm:text-[11px] text-signal-dim uppercase tracking-wider">
                Job Application
              </p>

              <h2
                className="
                  font-display
                  text-xl
                  sm:text-2xl
                  md:text-3xl
                  font-semibold
                  mt-1
                  pr-12
                  break-words
                "
              >
                {selectedJob?.title}
              </h2>

              {/* Close X button */}
              <button
                type="button"
                onClick={closeApplication}
                className="
                  absolute
                  top-4
                  right-4
                  sm:top-5
                  sm:right-5
                  w-9
                  h-9
                  sm:w-10
                  sm:h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  border
                  border-line-soft
                  text-graphite
                  text-xl
                  hover:bg-ink
                  hover:text-paper
                  hover:border-ink
                  transition-all
                "
                aria-label="Close application form"
                title="Close"
              >
                ×
              </button>
            </div>

            {/* =========================================================
                PROGRESS BAR
                ========================================================= */}

            {!submitted && (
              <div className="px-5 sm:px-7 pt-5 sm:pt-6 shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[1, 2, 3].map((number) => (
                    <div
                      key={number}
                      className={`
                        h-1.5
                        flex-1
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          step >= number
                            ? "bg-signal"
                            : "bg-line-soft"
                        }
                      `}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center gap-3 mt-2">
                  <p className="text-[10px] sm:text-[11px] text-graphite">
                    Step {step} of 3
                  </p>

                  <p className="text-[10px] sm:text-[11px] text-signal-dim text-right">
                    {step === 1 && "Personal Information"}
                    {step === 2 && "Professional Information"}
                    {step === 3 && "Confirmation"}
                  </p>
                </div>
              </div>
            )}

            {/* =========================================================
                SCROLLABLE CONTENT
                ========================================================= */}

            <div
              id="career-application-content"
              className="
                px-5
                sm:px-7
                py-5
                sm:py-6
                overflow-y-auto
                flex-1
                min-h-0
              "
            >
              {/* =======================================================
                  STEP 1 - PERSONAL INFORMATION
                  ======================================================= */}

              {step === 1 && !submitted && (
                <form onSubmit={handleStep1Continue} noValidate>
                  <h3 className="font-display text-lg sm:text-xl font-semibold mb-1">
                    Tell us about yourself
                  </h3>

                  <p className="text-xs sm:text-sm text-graphite mb-5">
                    Please provide your basic contact information.
                  </p>

                  <div className="space-y-4">
                    {/* NAME */}

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs sm:text-sm font-medium mb-1.5"
                      >
                        Full Name{" "}
                        <span className="text-signal">*</span>
                      </label>

                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="Enter your full name"
                        className={`
                          w-full
                          border
                          rounded-xl
                          px-4
                          py-3
                          bg-white
                          text-sm
                          outline-none
                          transition-all
                          ${
                            errors.name
                              ? "border-red-500 focus:border-red-500"
                              : "border-line-soft focus:border-signal focus:ring-2 focus:ring-signal/10"
                          }
                        `}
                      />

                      {/* Name character counter */}
                      <div className="flex justify-between mt-1.5">
                        <FieldError message={errors.name} />

                        <span className="text-[10px] text-graphite ml-auto">
                          {formData.name.length}/100
                        </span>
                      </div>
                    </div>

                    {/* PHONE */}

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs sm:text-sm font-medium mb-1.5"
                      >
                        Phone Number{" "}
                        <span className="text-signal">*</span>
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          // Allow only numbers.
                          const onlyNumbers = e.target.value.replace(
                            /\D/g,
                            ""
                          );

                          // Limit to 10 digits.
                          const limitedNumber = onlyNumbers.slice(
                            0,
                            10
                          );

                          setFormData((previousData) => ({
                            ...previousData,
                            phone: limitedNumber,
                          }));

                          setErrors((previousErrors) => ({
                            ...previousErrors,
                            phone: "",
                          }));
                        }}
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10 digit mobile number"
                        className={`
                          w-full
                          border
                          rounded-xl
                          px-4
                          py-3
                          bg-white
                          text-sm
                          outline-none
                          transition-all
                          ${
                            errors.phone
                              ? "border-red-500 focus:border-red-500"
                              : "border-line-soft focus:border-signal focus:ring-2 focus:ring-signal/10"
                          }
                        `}
                      />

                      <div className="flex justify-between mt-1.5">
                        <FieldError message={errors.phone} />

                        <span className="text-[10px] text-graphite ml-auto">
                          {formData.phone.length}/10
                        </span>
                      </div>
                    </div>

                    {/* GMAIL */}

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs sm:text-sm font-medium mb-1.5"
                      >
                        Gmail Address{" "}
                        <span className="text-signal">*</span>
                      </label>

                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@gmail.com"
                        className={`
                          w-full
                          border
                          rounded-xl
                          px-4
                          py-3
                          bg-white
                          text-sm
                          outline-none
                          transition-all
                          ${
                            errors.email
                              ? "border-red-500 focus:border-red-500"
                              : "border-line-soft focus:border-signal focus:ring-2 focus:ring-signal/10"
                          }
                        `}
                      />

                      <FieldError message={errors.email} />
                    </div>

                    {/* LINKEDIN */}

                    <div>
                      <label
                        htmlFor="linkedin"
                        className="block text-xs sm:text-sm font-medium mb-1.5"
                      >
                        LinkedIn URL{" "}
                        <span className="text-graphite">
                          (Optional)
                        </span>
                      </label>

                      <input
                        id="linkedin"
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="https://www.linkedin.com/in/your-profile"
                        className={`
                          w-full
                          border
                          rounded-xl
                          px-4
                          py-3
                          bg-white
                          text-sm
                          outline-none
                          transition-all
                          ${
                            errors.linkedin
                              ? "border-red-500 focus:border-red-500"
                              : "border-line-soft focus:border-signal focus:ring-2 focus:ring-signal/10"
                          }
                        `}
                      />

                      <FieldError message={errors.linkedin} />
                    </div>
                  </div>

                  {/* Continue button */}

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="
                        w-full
                        sm:w-auto
                        bg-ink
                        text-paper
                        rounded-full
                        px-8
                        py-3
                        font-mono-label
                        text-sm
                        hover:bg-signal
                        transition-all
                        duration-300
                      "
                    >
                      Continue →
                    </button>
                  </div>
                </form>
              )}

              {/* =======================================================
                  STEP 2 - PROFESSIONAL INFORMATION
                  ======================================================= */}

              {step === 2 && !submitted && (
                <form onSubmit={handleStep2Continue} noValidate>
                  <h3 className="font-display text-lg sm:text-xl font-semibold mb-1">
                    Professional information
                  </h3>

                  <p className="text-xs sm:text-sm text-graphite mb-5">
                    Tell us about your education and experience.
                  </p>

                  <div className="space-y-4">
                    {/* QUALIFICATION */}

                    <div>
                      <label
                        htmlFor="qualification"
                        className="block text-xs sm:text-sm font-medium mb-1.5"
                      >
                        Qualification{" "}
                        <span className="text-signal">*</span>
                      </label>

                      <input
                        id="qualification"
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="e.g. B-Tech (Computer)"
                        className={`
                          w-full
                          border
                          rounded-xl
                          px-4
                          py-3
                          bg-white
                          text-sm
                          outline-none
                          transition-all
                          ${
                            errors.qualification
                              ? "border-red-500 focus:border-red-500"
                              : "border-line-soft focus:border-signal focus:ring-2 focus:ring-signal/10"
                          }
                        `}
                      />

                      <FieldError message={errors.qualification} />
                    </div>

                    {/* EXPERIENCE */}

                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-xs sm:text-sm font-medium mb-1.5"
                      >
                        Experience{" "}
                        <span className="text-signal">*</span>
                      </label>

                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`
                          w-full
                          border
                          rounded-xl
                          px-4
                          py-3
                          bg-white
                          text-sm
                          outline-none
                          transition-all
                          ${
                            errors.experience
                              ? "border-red-500 focus:border-red-500"
                              : "border-line-soft focus:border-signal focus:ring-2 focus:ring-signal/10"
                          }
                        `}
                      >
                        <option value="">Select experience</option>

                        <option value="0-2 Years">
                          0-2 Years
                        </option>

                        <option value="2-5 Years">
                          2-5 Years
                        </option>

                        <option value="5-10 Years">
                          5-10 Years
                        </option>

                        <option value="10-12 Years">
                          10-12 Years
                        </option>

                        <option value="12-14 Years">
                          12-14 Years
                        </option>
                      </select>

                      <FieldError message={errors.experience} />
                    </div>

                    {/* CITY */}

                    <div>
                      <label
                        htmlFor="city"
                        className="block text-xs sm:text-sm font-medium mb-1.5"
                      >
                        Residential City{" "}
                        <span className="text-signal">*</span>
                      </label>

                      <input
                        id="city"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={(e) => {
                          // Allow only letters, spaces, dots and hyphens.
                          const cleanedCity = e.target.value
                            .replace(/[^A-Za-z .-]/g, "")
                            .slice(0, 20);

                          setFormData((previousData) => ({
                            ...previousData,
                            city: cleanedCity,
                          }));

                          setErrors((previousErrors) => ({
                            ...previousErrors,
                            city: "",
                          }));
                        }}
                        maxLength={20}
                        placeholder="Enter your city"
                        className={`
                          w-full
                          border
                          rounded-xl
                          px-4
                          py-3
                          bg-white
                          text-sm
                          outline-none
                          transition-all
                          ${
                            errors.city
                              ? "border-red-500 focus:border-red-500"
                              : "border-line-soft focus:border-signal focus:ring-2 focus:ring-signal/10"
                          }
                        `}
                      />

                      <div className="flex justify-between mt-1.5">
                        <FieldError message={errors.city} />

                        <span className="text-[10px] text-graphite ml-auto">
                          {formData.city.length}/20
                        </span>
                      </div>
                    </div>

                    {/* RESUME */}

                    <div>
                      <label
                        htmlFor="resume"
                        className="block text-xs sm:text-sm font-medium mb-1.5"
                      >
                        Resume{" "}
                        <span className="text-signal">*</span>
                        <span className="text-graphite">
                          {" "}
                          (PDF, Max 3 MB)
                        </span>
                      </label>

                      <input
                        id="resume"
                        type="file"
                        name="resume"
                        accept="application/pdf,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;

                          // Clear previous error.
                          setErrors((previousErrors) => ({
                            ...previousErrors,
                            resume: "",
                          }));

                          // If no file was selected.
                          if (!file) {
                            setFormData((previousData) => ({
                              ...previousData,
                              resume: null,
                            }));

                            return;
                          }

                          // Validate extension.
                          const isPdf =
                            file.name
                              .toLowerCase()
                              .endsWith(".pdf") &&
                            (!file.type ||
                              file.type === "application/pdf");

                          if (!isPdf) {
                            setErrors((previousErrors) => ({
                              ...previousErrors,
                              resume: "Only PDF files are allowed.",
                            }));

                            setFormData((previousData) => ({
                              ...previousData,
                              resume: null,
                            }));

                            // Reset file input.
                            e.target.value = "";

                            return;
                          }

                          // Validate maximum size.
                          if (file.size > MAX_RESUME_SIZE) {
                            setErrors((previousErrors) => ({
                              ...previousErrors,
                              resume: "Resume size must not exceed 3 MB.",
                            }));

                            setFormData((previousData) => ({
                              ...previousData,
                              resume: null,
                            }));

                            // Reset file input.
                            e.target.value = "";

                            return;
                          }

                          // File is valid.
                          setFormData((previousData) => ({
                            ...previousData,
                            resume: file,
                          }));
                        }}
                        className={`
                          w-full
                          border
                          rounded-xl
                          px-3
                          py-2.5
                          bg-white
                          text-xs
                          sm:text-sm
                          transition-all
                          ${
                            errors.resume
                              ? "border-red-500"
                              : "border-line-soft"
                          }
                          file:mr-2
                          sm:file:mr-4
                          file:rounded-full
                          file:border-0
                          file:bg-ink
                          file:px-3
                          sm:file:px-4
                          file:py-2
                          file:text-[10px]
                          sm:file:text-xs
                          file:font-medium
                          file:text-paper
                          hover:file:bg-signal
                        `}
                      />

                      <FieldError message={errors.resume} />

                      {/* Show selected resume */}
                      {formData.resume && !errors.resume && (
                        <p className="text-xs text-signal-dim mt-2 truncate">
                          ✓ {formData.resume.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Back + Continue buttons */}

                  <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setErrors((previousErrors) => ({
                          ...previousErrors,
                          qualification: "",
                          experience: "",
                          city: "",
                          resume: "",
                        }));

                        setStep(1);
                      }}
                      className="
                        w-full
                        sm:w-auto
                        border
                        border-line-soft
                        rounded-full
                        px-7
                        py-3
                        font-mono-label
                        text-sm
                        hover:border-signal
                        hover:text-signal-dim
                        transition-all
                      "
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      className="
                        w-full
                        sm:w-auto
                        bg-ink
                        text-paper
                        rounded-full
                        px-8
                        py-3
                        font-mono-label
                        text-sm
                        hover:bg-signal
                        transition-all
                        duration-300
                      "
                    >
                      Continue →
                    </button>
                  </div>
                </form>
              )}

              {/* =======================================================
                  STEP 3 - CONFIRMATION
                  ======================================================= */}

              {step === 3 && !submitted && (
                <form onSubmit={handleSubmit}>
                  <h3 className="font-display text-lg sm:text-xl font-semibold mb-1">
                    Review your application
                  </h3>

                  <p className="text-xs sm:text-sm text-graphite mb-5">
                    Please check your information before submitting.
                  </p>

                  {/* Selected job */}

                  <div className="bg-ink text-paper rounded-xl p-4 mb-4">
                    <p className="font-mono-label text-[10px] text-mist uppercase">
                      Applying for
                    </p>

                    <p className="font-display text-base sm:text-lg font-semibold mt-1 break-words">
                      {selectedJob?.title}
                    </p>
                  </div>

                  {/* Application information */}

                  <div className="border border-line-soft rounded-xl overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      <ConfirmationItem
                        label="Name"
                        value={formData.name}
                      />

                      <ConfirmationItem
                        label="Phone"
                        value={formData.phone}
                      />

                      <ConfirmationItem
                        label="Email"
                        value={formData.email}
                      />

                      <ConfirmationItem
                        label="LinkedIn"
                        value={
                          formData.linkedin
                            ? formData.linkedin
                            : "Not provided"
                        }
                      />

                      <ConfirmationItem
                        label="Qualification"
                        value={formData.qualification}
                      />

                      <ConfirmationItem
                        label="Experience"
                        value={formData.experience}
                      />

                      <ConfirmationItem
                        label="Residential City"
                        value={formData.city}
                      />

                      <ConfirmationItem
                        label="Resume"
                        value={
                          formData.resume
                            ? formData.resume.name
                            : "Not uploaded"
                        }
                      />
                    </div>
                  </div>

                  {/* Back + Submit buttons */}

                  <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="
                        w-full
                        sm:w-auto
                        border
                        border-line-soft
                        rounded-full
                        px-7
                        py-3
                        font-mono-label
                        text-sm
                        hover:border-signal
                        hover:text-signal-dim
                        transition-all
                      "
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      className="
                        w-full
                        sm:w-auto
                        bg-signal
                        text-white
                        rounded-full
                        px-8
                        py-3
                        font-mono-label
                        text-sm
                        hover:opacity-90
                        transition-all
                      "
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}

              {/* =======================================================
                  SUCCESS SCREEN
                  ======================================================= */}

              {submitted && (
                <div className="text-center py-8">
                  <div
                    className="
                      w-16
                      h-16
                      rounded-full
                      bg-signal
                      mx-auto
                      flex
                      items-center
                      justify-center
                      text-white
                      text-3xl
                      shadow-lg
                    "
                  >
                    ✓
                  </div>

                  <h3 className="font-display text-3xl font-semibold mt-6">
                    Applied
                  </h3>

                  <p className="text-sm text-graphite mt-3 max-w-md mx-auto">
                    Your application for{" "}
                    <strong>{selectedJob?.title}</strong>{" "}
                    has been submitted successfully.
                  </p>

                  <button
                    type="button"
                    onClick={closeApplication}
                    className="
                      mt-7
                      bg-ink
                      text-paper
                      rounded-full
                      px-8
                      py-3
                      font-mono-label
                      text-sm
                      hover:bg-signal
                      transition-all
                    "
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| FIELD ERROR COMPONENT
|--------------------------------------------------------------------------
*/

const FieldError = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <p
      className="
        text-red-500
        text-xs
        mt-1.5
        leading-relaxed
      "
      role="alert"
    >
      {message}
    </p>
  );
};

/*
|--------------------------------------------------------------------------
| CONFIRMATION ITEM
|--------------------------------------------------------------------------
*/

const ConfirmationItem = ({ label, value }) => {
  return (
    <div
      className="
        p-3.5
        sm:p-4
        border-b
        border-r
        border-line-soft
        min-w-0
      "
    >
      <p className="text-[10px] md:text-xs text-graphite mb-1">
        {label}
      </p>

      <p className="text-xs md:text-sm font-medium break-words">
        {value}
      </p>
    </div>
  );
};


