"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash } from "lucide-react";
import getLocationImages from "../GetLocation/getLocationImages";
import { saveLocationImages } from "../SaveActions/saveLocationImages";
import { deleteLocationImage } from "../SaveActions/deleteLocationImage";
import { convertHeicToPngIfNeeded } from "../../../lib/convertHeicToPng";
import StatusModal from "../../../components/StatusModal";

export default function LocationImages({ projectID, projectSlug }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileUploadId = "locationFileUpload";

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const data = await getLocationImages(projectID);
      setImages(data);
      setLoading(false);
    };

    loadImages();
  }, [projectID, reload]);

  const handleFiles = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      // Convierte cualquier foto HEIC/HEIF (formato por defecto de iPhone)
      // a PNG antes de subir, para evitar errores de visualización después.
      const convertedFiles = await Promise.all(
        selectedFiles.map(convertHeicToPngIfNeeded),
      );
      const result = await saveLocationImages(
        convertedFiles,
        projectID,
        projectSlug,
      );
      setStatus(result);
      if (result.ok) {
        setReload((prev) => !prev);
      }
    } finally {
      setUploading(false);
    }
    // Permite volver a seleccionar el mismo archivo si el usuario lo borra
    // y lo quiere subir de nuevo.
    e.target.value = "";
  };

  const handleDelete = async (imgRoute) => {
    const result = await deleteLocationImage(projectID, imgRoute);
    setStatus(result);
    if (result.ok) {
      setReload((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        id={fileUploadId}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFiles}
        disabled={uploading}
        className="hidden"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-center">
        {/* Mientras sube, muestra un spinner y bloquea el clic para no
            disparar otra subida encima. */}
        <label
          htmlFor={fileUploadId}
          className={`card bg-secondary w-[150px] h-[150px] shadow-lg font-black text-center text-3xl flex justify-center items-center ${
            uploading ? "pointer-events-none opacity-70" : "cursor-pointer"
          }`}
        >
          {uploading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "+"
          )}
        </label>

        {uploading && (
          <p className="col-span-full text-sm opacity-70">
            Subiendo imágenes...
          </p>
        )}

        {loading == false &&
          images.map((image, index) => (
            <div key={index} className="relative w-[150px] h-[150px]">
              <Link
                href={image.img_link}
                target="_blank"
                className="block w-full h-full"
              >
                <Image
                  src={image.img_link}
                  className="card w-[150px] h-[150px]"
                  width={150}
                  height={150}
                  alt="Imagen de ubicación, dar click para abrir individualmente"
                ></Image>
              </Link>

              <button
                type="button"
                className="btn btn-error btn-xs btn-circle absolute top-1 right-1"
                onClick={() => handleDelete(image.img_route)}
                aria-label="Borrar imagen"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
      </div>

      {loading == true && (
        <span className="loading loading-dots loading-xl"></span>
      )}

      <StatusModal status={status} onClose={() => setStatus(null)} />
    </div>
  );
}
