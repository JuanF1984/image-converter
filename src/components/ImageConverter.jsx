import { useState } from 'react'
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const ImageConverter = () => {
    const [images, setImages] = useState([]);
    const [quality, setQuality] = useState(0.8);
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [convertToWebP, setConvertToWebP] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");


    // Manejo de selección y arrastrar imágenes
    const handleFiles = (files) => {
        const fileList = Array.from(files).filter((file) =>
            file.type.startsWith("image/")
        );
        setImages((prev) => [...prev, ...fileList]);
    };

    // Procesar imágenes y aplicar conversión/redimensionado
    const processImages = async () => {
        if (images.length === 0) return;
        setLoading(true);

        const zip = new JSZip();
        const promises = images.map((file) => processImage(file, zip));

        await Promise.all(promises);

        if (images.length > 1) {
            // Si hay varias imágenes, descargar 
            const zip = new JSZip();
            images.forEach((file) => {
                zip.file(file.name, file);
            });
            zip.generateAsync({ type: "blob" }).then((content) => {
                saveAs(content, "imagenes_procesadas.zip");
                setSuccessMessage("¡Proceso completado con éxito!");
                setImages([]); // Limpiar la lista de imágenes
                setLoading(false);
            });
        } else {
            // Para una sola imagen, procesarla y descargarla
            const file = images[0];
            const format = convertToWebP ? "image/webp" : file.type;

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const newWidth = width || img.width;
                const newHeight = height || img.height;

                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(
                    (blob) => {
                        const fileName = file.name.replace(/\.\w+$/, convertToWebP ? ".webp" : `.${file.name.split('.').pop()}`);
                        const contentType = convertToWebP ? "image/webp" : file.type;
                        const newBlob = new Blob([blob], { type: contentType });
                        saveAs(newBlob, fileName);
                        setSuccessMessage("¡Proceso completado con éxito!");
                        setImages([]);
                        setLoading(false);
                    },
                    format,
                    quality
                );
            };
        }
    };

    // Convertir/redimensionar imagen
    const processImage = (file, zip) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    const newWidth = width || img.width;
                    const newHeight = height || img.height;

                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    const format = convertToWebP ? "image/webp" : file.type;
                    canvas.toBlob(
                        (blob) => {
                            zip.file(
                                file.name.replace(/\.\w+$/, convertToWebP ? ".webp" : `.${file.type.split('/')[1]}`),
                                blob
                            );
                            resolve();
                        },
                        format,
                        convertToWebP ? quality : 1
                    );
                };
            };
        });
    };

    return (
        <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg bg-white">
            <h2 className="text-xl font-bold mb-4 text-center">
                Conversor y Redimensionador de Imágenes
            </h2>

            {/* Área para arrastrar y soltar */}
            <div
                className="border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer"
                onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                }}
                onDragOver={(e) => e.preventDefault()}
            >
                <p className="text-gray-600">Arrastra y suelta imágenes aquí</p>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="fileInput"
                    onChange={(e) => handleFiles(e.target.files)}
                />
                <label
                    htmlFor="fileInput"
                    className="block mt-2 bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
                >
                    O selecciona archivos
                </label>
            </div>

            {/* Lista de imágenes seleccionadas */}
            <div className="mt-4">
                {images.map((file, index) => (
                    <p key={index} className="text-sm text-gray-700">
                        {file.name}
                    </p>
                ))}
            </div>

            {/* Opciones de conversión */}
            <div className="mt-4 space-y-2">
                <label className="block">
                    <input
                        type="checkbox"
                        checked={convertToWebP}
                        onChange={() => setConvertToWebP(!convertToWebP)}
                        className="mr-2"
                    />
                    Convertir a WebP
                </label>
                <label className="block">
                    Calidad:
                    <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </label>
                <label className="block">
                    Ancho (px):
                    <input
                        type="number"
                        value={width || ""}
                        onChange={(e) => setWidth(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full border p-1 rounded"
                    />
                </label>
                <label className="block">
                    Alto (px):
                    <input
                        type="number"
                        value={height || ""}
                        onChange={(e) => setHeight(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full border p-1 rounded"
                    />
                </label>
            </div>

            {/* Botón de conversión */}
            <button
                onClick={processImages}
                disabled={images.length === 0 || loading}
                className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
            >
                {loading ? "Procesando..." : "Procesar Imágenes"}
            </button>
            {successMessage && (
                <p className="mt-2 text-green-600 font-semibold">{successMessage}</p>
            )}
        </div>
    );
}
