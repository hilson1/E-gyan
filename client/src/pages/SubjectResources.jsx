import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

const SERVER = import.meta.env.VITE_API_URL;
const FALLBACK = "https://placehold.co/600x400/0f172a/ffffff?text=E-Gyan";

export default function SubjectResources() {
  const { subjectId } = useParams(); // ✅ FIXED

  const [notes, setNotes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    if (!subjectId) return;

    api.get(`/resources/subject/${subjectId}`).then((res) => {
      const data = res.data || [];

      setNotes(data.filter((r) => r.resource_type === "note"));
      setQuestions(data.filter((r) => r.resource_type === "question"));
      setPresentations(data.filter((r) => r.resource_type === "presentation"));
    });
  }, [subjectId]);

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200 p-6">
      <ResourceBlock title="Notes" data={notes} />
      <ResourceBlock title="Question Papers" data={questions} />
      <ResourceBlock title="Presentations" data={presentations} />
    </div>
  );
}

function ResourceBlock({ title, data }) {
  return (
    <section className="max-w-7xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {data.length === 0 ? (
        <p className="text-gray-500">No resources available</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((r) => (
            <div
              key={r.resource_id}
              className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden"
            >
              <img
                src={r.image_url ? `${SERVER}${r.image_url}` : FALLBACK}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold mb-2">{r.title}</h3>

                <a
                  href={`${SERVER}${r.file_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-indigo-400 hover:underline"
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
