import { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [jenisMakeup, setJenisMakeup] = useState('');
  const [merkMakeup, setMerkMakeup] = useState('');
  const [expired, setExpired] = useState('');
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Fungsi untuk mengambil data dari backend
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/makeup');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk menangani pengiriman form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Edit data (belum terhubung ke backend)
      const updatedData = data.map((item, index) =>
        index === editIndex ? { jenisMakeup, merkMakeup, expired } : item
      );
      setData(updatedData);
      setEditIndex(null);
    } else {
      // Tambahkan data baru ke backend
      try {
        await axios.post('http://localhost:5000/makeup', {
          jenisMakeup,
          merkMakeup,
          expired,
        });
        fetchData(); // Refresh data setelah menambahkan
      } catch (error) {
        console.error('Error adding data:', error);
      }
    }

    setJenisMakeup('');
    setMerkMakeup('');
    setExpired('');
  };

  // Fungsi untuk menghapus data
  const handleDelete = async (index) => {
    const id = data[index].id;
    try {
      await axios.delete(`http://localhost:5000/makeup/${id}`);
      fetchData(); // Refresh data setelah menghapus
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleEdit = (index) => {
    const itemToEdit = data[index];
    setJenisMakeup(itemToEdit.jenisMakeup);
    setMerkMakeup(itemToEdit.merkMakeup);
    setExpired(itemToEdit.expired);
    setEditIndex(index);
  };

  return (
    <div className="container">
      <h1>Daftar Makeup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="jenisMakeup">Jenis Makeup: </label>
          <input
            type="text"
            id="jenisMakeup"
            value={jenisMakeup}
            onChange={(e) => setJenisMakeup(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="merkMakeup">Merk Makeup: </label>
          <input
            type="text"
            id="merkMakeup"
            value={merkMakeup}
            onChange={(e) => setMerkMakeup(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="expired">Expired: </label>
          <input
            type="date"
            id="expired"
            value={expired}
            onChange={(e) => setExpired(e.target.value)}
            required
          />
        </div>

        <button type="submit">{editIndex !== null ? 'Update' : 'Tambahkan'}</button>
      </form>

      <h2>Daftar Makeup</h2>
      <table>
        <thead>
          <tr>
            <th>Jenis Makeup</th>
            <th>Merk Makeup</th>
            <th>Expired</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.jenisMakeup}</td>
              <td>{item.merkMakeup}</td>
              <td>{item.expired}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
