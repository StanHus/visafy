"use client";

import Image from "next/image";
import Link from "next/link";

const team = [
  { name: "Stan", photo: "/portarait stan.png" },
  { name: "Alexey", photo: "/portrait alexey.jpg" },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal back nav */}
      <nav className="px-6 py-5">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back
        </Link>
      </nav>

      {/* Main content — vertically centered */}
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="text-center">
          {/* Portraits */}
          <div className="flex items-center justify-center gap-12 sm:gap-20 mb-10">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center gap-4">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-2 ring-stone-100">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-lg font-medium text-gray-900 tracking-tight">
                  {member.name}
                </span>
              </div>
            ))}
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-brand-500 tracking-widest uppercase mb-8">
            Expanova Tech Team
          </p>

          {/* Divider */}
          <div className="w-8 h-px bg-gray-200 mx-auto mb-8" />

          {/* Footer */}
          <p className="text-xs text-gray-400">
            Built by{" "}
            <a
              href="https://expanova.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-brand-500 transition-colors"
            >
              Expanova.io
            </a>
            {" · "}© {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
