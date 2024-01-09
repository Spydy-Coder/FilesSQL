const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'bikash',
  database: 'pdf_upload',
});

connection.connect();

app.post('/upload', upload.single('file'), (req, res) => {
  const { originalname, buffer } = req.file;
  const { fileName, description } = req.body;

  const query = 'INSERT INTO pdf_files (file_name, description, file_data, file_type) VALUES (?, ?, ?, ?)';
  connection.query(query, [fileName, description, buffer, originalname.split('.').pop()], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ message: 'File uploaded successfully' });
    }
  });
});
app.get('/files', (req, res) => {
  const query = 'SELECT id, file_name FROM pdf_files';
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


app.get('/files/:id', (req, res) => {
  const fileId = req.params.id;
  const query = 'SELECT file_data,file_type FROM pdf_files WHERE id = ?';
  connection.query(query, [fileId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      const fileData = results[0].file_data;
      res.contentType('application/pdf');
      res.send(fileData);
    }
  });
});
app.get('/files/:id/type', (req, res) => {
  const fileId = req.params.id;
  const query = 'SELECT file_type FROM pdf_files WHERE id = ?';

  connection.query(query, [fileId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      const fileType = results[0].file_type;
      res.json({ fileType });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
