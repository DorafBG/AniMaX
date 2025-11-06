"use client";
import { useRef, useState } from "react";

export default function ProfilePicUpload({
  onUploaded,
}: {
  onUploaded: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await fetch("/api/user/upload-profile-pic", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      onUploaded();
    }
    setUploading(false);
  };

  return (
    <>
      <input
        ref={inputRef}
        id="profile-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
      <button
        type="button"
        className="absolute inset-0 w-full h-full"
        style={{ background: "rgba(0,0,0,0.0)" }}
        title="Changer la photo de profil"
        onClick={() => inputRef.current?.click()}
      >
        <span className="sr-only">Changer la photo de profil</span>
      </button>
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs">
          Upload...
        </div>
      )}
    </>
  );
}
