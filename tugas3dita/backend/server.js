const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Username MySQL default di XAMPP adalah 'root'
  password: '',      // Password default biasanya kosong di XAMPP
  database: 'dita_db' // Ganti dengan nama database Anda
});

// Cek koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Route: Test koneksi
app.get('/', (req, res) => {
  res.send('Hello, MySQL is connected!');
});

// Route: Ambil semua data makeup
app.get('/makeup', (req, res) => {
  const query = 'SELECT * FROM makeup';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }

    res.json({
      message: "Berhasil mendapat data",
      data: results
    });
  });
});

// Route: Tambah data makeup baru
app.post('/makeup', (req, res) => {
  const { jenisMakeup, merkMakeup, expired } = req.body;
  const query = 'INSERT INTO makeup (jenisMakeup, merkMakeup, expired) VALUES (?, ?, ?)';
  db.query(query, [jenisMakeup, merkMakeup, expired], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
      return;
    }
    res.status(201).send('Data makeup berhasil ditambahkan');
  });
});

// Route: Hapus data makeup berdasarkan ID
app.delete('/makeup/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM makeup WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting data:', err);
      res.status(500).send('Error deleting data');
      return;
    }
    res.send('Data makeup berhasil dihapus');
  });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
