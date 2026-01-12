import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "About | E-Gyan";
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-gray-300 px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">About E-Gyan</h1>
          <p className="text-lg text-gray-400">
            A modern academic platform built for Nepali university students
          </p>
        </div>

        {/* INTRO */}
        <section className="bg-slate-900 rounded-2xl p-8 shadow border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">
            What is E-Gyan?
          </h2>
          <p className="leading-relaxed">
            <span className="font-semibold text-white">E-Gyan</span> is a
            centralized digital learning platform designed to support students
            studying under{" "}
            <span className="font-semibold">Tribhuvan University (TU)</span> and{" "}
            <span className="font-semibold">Pokhara University (PU)</span>. The
            platform focuses on providing reliable, organized, and semester-wise
            academic resources to help students succeed in their studies.
          </p>
        </section>

        {/* PROGRAMS */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-3">
              Supported Universities
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Tribhuvan University (TU)</li>
              <li>Pokhara University (PU)</li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-3">
              Supported Programs
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>BBA (Bachelor of Business Administration)</li>
              <li>BCA (Bachelor of Computer Application)</li>
              <li>BBS (Bachelor of Business Studies)</li>
              <li>BHM (Bachelor of Hotel Management)</li>
            </ul>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-slate-900 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-6">
            What You’ll Find on E-Gyan
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Notes",
                desc: "Semester-wise, subject-wise notes curated for TU & PU syllabuses",
              },
              {
                title: "Question Papers",
                desc: "Past exam questions to help you prepare confidently",
              },
              {
                title: "Presentations",
                desc: "Clean and ready-to-use PPT slides for revision and study",
              },
              {
                title: "Syllabus",
                desc: "Faculty-wise and semester-wise syllabus structure",
              },
              {
                title: "AI Chatbot",
                desc: "AI-powered assistant to help answer academic queries",
              },
              {
                title: "User Dashboard",
                desc: "Personal account with activity tracking and saved resources",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-slate-800 rounded-xl p-5 hover:bg-slate-700 transition"
              >
                <h4 className="font-semibold text-white mb-2">{f.title}</h4>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MISSION */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Our Mission
          </h2>
          <p className="leading-relaxed">
            Our mission is to make quality academic resources easily accessible
            to every student. E-Gyan aims to reduce dependency on scattered
            materials by providing a single, reliable platform where students
            can learn, revise, and prepare efficiently.
          </p>
        </section>
      </div>
    </div>
  );
}
