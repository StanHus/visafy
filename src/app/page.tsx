import Link from "next/link";
import Navbar from "@/components/Navbar";

const steps = [
  {
    num: "1",
    title: "Create your account",
    description: "Sign up and start your personalized immigration application.",
  },
  {
    num: "2",
    title: "Complete the application",
    description: "Fill in your details through our guided multi-step form.",
  },
  {
    num: "3",
    title: "Submit and track",
    description: "Submit your application and monitor its progress.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-[1.15] mb-6">
            Your path to Spain, simplified.
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Navigate Spain&apos;s immigration process with a guided application
            that handles every step for you.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-base"
          >
            Start your application
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

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50/60">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">
            How it works
          </h2>
          <div className="space-y-8">
            {steps.map((item) => (
              <div key={item.num} className="flex gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-medium flex items-center justify-center">
                  {item.num}
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-gray-900 tracking-tight">
            KORE
          </span>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} KORE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
