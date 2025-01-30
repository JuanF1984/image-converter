import { ImageConverter } from "./components/ImageConverter"

function App() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Conversor de Imágenes a WebP</h1>
      <ImageConverter />
    </div>
  )
}

export default App
