import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Resources() {
  const { subjectId } = useParams();

  const [notes, setNotes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) return;

    api
      .get(`/api/resources/subject/${subjectId}`)
      .then((r) => {
        const data = r.data || [];
        console.log("Fetched resources:", data); // debug

        // Handle trailing spaces and case
        setNotes(
          data.filter(
            (x) =>
              x.resource_type && x.resource_type.trim().toLowerCase() === "note"
          )
        );
        setQuestions(
          data.filter(
            (x) =>
              x.resource_type &&
              x.resource_type.trim().toLowerCase() === "question"
          )
        );
        setPresentations(
          data.filter(
            (x) =>
              x.resource_type &&
              x.resource_type.trim().toLowerCase() === "presentation"
          )
        );
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [subjectId]);

  const getFullUrl = (path) =>
    path
      ? path.startsWith("http")
        ? path
        : `${BASE_URL}/${path.replace(/^\/+/, "")}`
      : null;

  const FileRow = ({ img, title, file }) => (
    <a
      href={getFullUrl(file)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 bg-base-200 p-4 rounded"
    >
      <img
        src={getFullUrl(img) || "https://via.placeholder.com/80"}
        className="h-14 w-14 rounded object-cover"
        alt={title}
      />
      <span className="font-medium">{title}</span>
    </a>
  );

  if (loading) return <p className="p-6">Loading resources...</p>;

  const renderSection = (title, items) => (
    <section>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {items.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((r) => (
            <a
              key={r.resource_id}
              href={getFullUrl(r.file_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded overflow-hidden bg-gray-200"
            >
              <img
                src={
                  getFullUrl(r.image_url) || "https://via.placeholder.com/160"
                }
                className="h-40 w-full object-cover"
                alt={r.title}
              />
              <div className="p-2 text-center font-semibold">{r.title}</div>
            </a>
          ))}
        </div>
      ) : (
        <p>No {title.toLowerCase()} found</p>
      )}
    </section>
  );

  return (
    <div className="p-6 space-y-10">
      {renderSection("Notes", notes)}
      {renderSection("Questions", questions)}
      {renderSection("Presentations", presentations)}
    </div>
  );
}
