import { useState, useEffect } from 'react';

const API_URL = '/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) setStudents(data);
    } catch (err) {
      console.error('Lỗi lấy danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Thêm thành công!');
        setStudentId('');
        setName('');
        setEmail('');
        fetchStudents();
      } else {
        alert('Lỗi từ Server: ' + JSON.stringify(data));
      }
    } catch (err) {
      alert('Lỗi kết nối API: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>
      <h2>Quản Lý Sinh Viên</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input placeholder="MSSV" value={studentId} onChange={(e) => setStudentId(e.target.value)} style={{ margin: '5px' }} />
        <input placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} style={{ margin: '5px' }} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ margin: '5px' }} />
        <button type="submit">Thêm Sinh Viên</button>
      </form>

      <h3>Danh Sách Sinh Viên</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map((st) => (
          <li key={st._id || st.studentId}>
            {st.studentId} - {st.name} - {st.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;