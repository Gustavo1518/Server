const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Configuración de multer para almacenar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log(`Saving file as: ${filename}`);
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Ruta para cargar archivos PDF
app.post('/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    console.log('No file uploaded.');
    return res.status(400).send('No se cargó ningún archivo.');
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  console.log(`File uploaded successfully: ${fileUrl}`);
  res.status(200).json({ url: fileUrl });
});

// Ruta para servir los archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Manejo de errores de ruta
app.use((req, res, next) => {
  res.status(404).send('No se encontró el recurso solicitado.');
});

// Inicializa el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
