"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif"
];

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const infoBlocks = [
  {
    title: "Why this demo?",
    copy:
      "You asked if you can upload a picture here. This playground does not accept uploads directly, but this page shows how a drag-and-drop uploader could work if the platform enabled image sharing."
  },
  {
    title: "What actually happens?",
    copy:
      "The file never leaves your browser. Everything stays client-side. We render a preview so you understand what information could be captured if uploads were supported."
  },
  {
    title: "What if I need to share?",
    copy:
      "Use an external host (Google Drive, Dropbox, Imgur) and paste the shareable link in the chat. That keeps your files in your control while still letting collaborators see them."
  }
];

export default function HomePage() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const addFiles = useCallback((fileList) => {
    const next = Array.from(fileList)
      .filter((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          return false;
        }
        return true;
      })
      .map((file) => ({
        file,
        id: `${file.name}-${file.size}-${file.lastModified}`,
        url: URL.createObjectURL(file)
      }));

    setFiles((current) => {
      const merged = [...current];
      next.forEach((item) => {
        if (!merged.some((f) => f.id === item.id)) {
          merged.push(item);
        }
      });
      return merged;
    });
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragging(false);
      if (event.dataTransfer?.files?.length) {
        addFiles(event.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    if (!dragging) {
      setDragging(true);
    }
  }, [dragging]);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    setDragging(false);
  }, []);

  const previews = useMemo(
    () =>
      files.map((entry) => (
        <article className="preview-card" key={entry.id}>
          <Image
            src={entry.url}
            alt={entry.file.name}
            width={320}
            height={200}
            className="preview-image"
            unoptimized
            sizes="(max-width: 768px) 100vw, 160px"
            onLoadingComplete={() => URL.revokeObjectURL(entry.url)}
          />
          <div className="file-info">
            <span>{entry.file.name}</span>
            <span>{formatBytes(entry.file.size)}</span>
            <span>{entry.file.type || "unknown type"}</span>
          </div>
        </article>
      )),
    [files]
  );

  return (
    <main>
      <h1>Can you upload a pic here?</h1>
      <p>
        Not inside this chat interface, but here&apos;s a safe sandbox so you can
        see what a future upload experience could look like. Drop a file below
        to preview it locally.
      </p>

      <section>
        <div
          className={`uploader${dragging ? " dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            multiple
            onChange={(event) => {
              if (event.target.files?.length) {
                addFiles(event.target.files);
                event.target.value = "";
              }
            }}
          />
          <div>
            <strong>Drag &amp; drop an image file here</strong>
            <div className="helper">PNG, JPG, GIF, WebP — up to 10MB each.</div>
          </div>
          <button type="button" onClick={openFilePicker}>
            Choose files
          </button>
          <div className="hint">
            Files never leave this browser tab. Refresh to clear the previews.
          </div>
        </div>

        {files.length > 0 && <div className="preview-grid">{previews}</div>}

        <div>
          {infoBlocks.map((block) => (
            <article key={block.title}>
              <h2>{block.title}</h2>
              <p>{block.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
