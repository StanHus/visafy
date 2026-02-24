import Link from "next/link";
import Navbar from "@/components/Navbar";

const visaTypes = [
  {
    title: "Work Visa",
    description: "Employment-based immigration for professionals with a job offer in Spain.",
    icon: "💼",
  },
  {
    title: "Golden Visa",
    description: "Residency through significant investment in Spanish real estate or businesses.",
    icon: "🏆",
  },
  {
    title: "Student Visa",
    description: "Study at Spanish universities and educational institutions.",
    icon: "🎓",
  },
  {
    title: "Digital Nomad",
    description: "Remote work visa for international professionals working for foreign companies.",
    icon: "💻",
  },
  {
    title: "Family Reunification",
    description: "Join your family members who are legal residents of Spain.",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    title: "Non-Lucrative",
    description: "Live in Spain without working, supported by passive income or savings.",
    icon: "🌴",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Account",
    description: "Sign up in seconds and begin your personalized immigration journey.",
  },
  {
    step: "02",
    title: "Complete Your Application",
    description: "Fill out our guided multi-step form with all required information and documents.",
  },
  {
    step: "03",
    title: "Track & Get Approved",
    description: "Monitor your application status in real-time as our experts process it.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Trusted by 2,000+ applicants
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Your Path to Spain{" "}
              <span className="text-orange-500">Starts Here</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Navigate Spain&apos;s immigration process with confidence. Our platform
              guides you through every step — from application to approval.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-sm text-base"
              >
                Start Your Application
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-orange-500 hover:text-orange-500 transition-all duration-200 text-base"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visa Types */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Visa Types We Support
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whatever your reason for moving to Spain, we have the expertise
              to guide your application.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visaTypes.map((visa) => (
              <div
                key={visa.title}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-3xl mb-4">{visa.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {visa.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {visa.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start your new life in Spain.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <span className="text-orange-500 text-xl font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of successful applicants who chose Visafy for their
            Spain immigration process.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-sm text-base"
          >
            Start Your Application
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Visafy</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Visafy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
