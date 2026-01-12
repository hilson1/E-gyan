import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

const SERVER = import.meta.env.VITE_API_URL;
const FALLBACK = "https://placehold.co/600x400/0f172a/ffffff?text=E-Gyan";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/home-resources")
      .then((res) => {
        setNotes(res.data.notes || []);
        setQuestions(res.data.questions || []);
        setPresentations(res.data.presentations || []);
      })
      .catch((err) => {
        console.error("HOME FETCH ERROR:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-950 text-gray-200">
      {/* HERO */}
      <section className="py-20 text-center border-b border-white/10">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          <span className="text-indigo-400">Notes</span>, Questions &
          Presentations
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg">
          Semester-wise academic resources for TU & PU students
        </p>
      </section>

      {/* QUICK LINKS */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Notes", link: "/usernotes" },
          { title: "Question Papers", link: "/questions" },
          { title: "Syllabus", link: "/syllabus" },
          { title: "Faculty", link: "/faculty" },
          { title: "Presentation", link: "/presentation" },
          { title: "AI Chatbot", link: "/ai-chatbot" },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.link}
            className="rounded-2xl bg-slate-900 border border-white/10 p-6 hover:bg-slate-800 transition"
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">
              Organized academic resources
            </p>
          </Link>
        ))}
      </section>

      <ResourceSection
        title="Latest Notes"
        data={notes}
        loading={loading}
        viewAll="/usernotes"
      />

      <ResourceSection
        title="Question Papers"
        data={questions}
        loading={loading}
        viewAll="/questions"
      />

      <ResourceSection
        title="Presentations"
        data={presentations}
        loading={loading}
        viewAll="/presentation"
      />
    </div>
  );
}

/* =========================
   RESOURCE SECTION
========================= */
function ResourceSection({ title, data, viewAll, loading }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link to={viewAll} className="text-sm text-indigo-400 hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">No resources available</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item.resource_id}
              className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={item.image_url ? `${SERVER}${item.image_url}` : FALLBACK}
                alt={item.title}
                className="h-44 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {item.title}
                </h3>

                <a
                  href={`${SERVER}${item.file_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-sm text-indigo-400 hover:underline"
                >
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
