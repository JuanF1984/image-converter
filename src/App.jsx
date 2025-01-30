import { ImageConverter } from "./components/ImageConverter"
import logo from './assets/logoImgGenerator.webp'

function App() {

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <img src={logo} alt="Logo" className="w-28 h-28 rounded-full mb-4" />
        <h1 className="text-2xl font-bold mb-4">Conversor de Imágenes a WebP</h1>
        <ImageConverter />
      </div>
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} Todos los derechos reservados - Hecho por Sur Digital</p>
        </div>
      </footer>
    </>
  )
}

export default App
