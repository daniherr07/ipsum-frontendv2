"use client";

function isHeicFile(file) {
  const name = (file.name || "").toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

// Los iPhone toman fotos en HEIC/HEIF por defecto (el navegador no puede
// mostrarlas ni el visor de fotos del sistema en Windows las abre siempre
// sin problema, y Dropbox tampoco genera una vista previa consistente para
// ese formato). Se convierte a PNG en el navegador ANTES de subir, así el
// archivo que llega al backend/Dropbox ya es un formato universal. Si el
// archivo no es HEIC, se devuelve tal cual (sin recomprimir de más).
export async function convertHeicToPngIfNeeded(file) {
  if (!isHeicFile(file)) return file;

  try {
    const heic2any = (await import("heic2any")).default;
    const result = await heic2any({ blob: file, toType: "image/png" });
    const blob = Array.isArray(result) ? result[0] : result;
    const newName = file.name.replace(/\.(heic|heif)$/i, ".png");

    return new File([blob], newName, { type: "image/png" });
  } catch (error) {
    console.error("No se pudo convertir la imagen HEIC a PNG", error);
    // Si la conversión falla, se sube el archivo original de todas formas
    // en vez de bloquear al usuario — puede que el backend/Dropbox lo
    // acepten igual.
    return file;
  }
}
