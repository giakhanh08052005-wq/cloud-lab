import { useState, useEffect } from 'react';

const API_URL = 'https://mern-backend-1-0-s7cn.onrender.com/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  // 1. Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Thêm mới (POST - Câu 37) hoặc Cập nhật (PUT - Câu 61)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !name || !email) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, email }),
      });

      if (res.ok) {
        setStudentId('');
        setName('');
        setEmail('');
        setEditingId(null);
        await fetchStudents();
      } else {
        const responseText = await res.text();
        let message = `HTTP ${res.status}: Thao tác thất bại`;
        try {
          const errData = JSON.parse(responseText);
          message = errData.message || message;
        } catch {
          if (responseText) message = responseText.slice(0, 120);
        }
        alert('Lỗi: ' + message);
      }
    } catch (error) {
      alert('Lỗi kết nối API: ' + error.message);
    }
  };

  // 3. Chọn sinh viên để sửa
  const handleEdit = (st) => {
    setEditingId(st._id);
    setStudentId(st.studentId);
    setName(st.name);
    setEmail(st.email);
  };

  // 4. Hủy chế độ sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setStudentId('');
    setName('');
    setEmail('');
  };

  // 5. Xóa sinh viên (DELETE - Câu 62)
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchStudents();
      } else {
        alert('Không thể xóa sinh viên');
      }
    } catch (error) {
      alert('Lỗi khi xóa: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', color: '#fff', backgroundColor: '#1e1e1e', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Quản Lý Sinh Viên - Version 2.0</h1>

      {/* Form nhập dữ liệu */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="MSSV"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', backgroundColor: editingId ? '#e67e22' : '#2ecc71', color: '#fff', border: 'none', fontWeight: 'bold' }}>
          {editingId ? 'Cập Nhật' : 'Thêm Sinh Viên'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#7f8c8d', color: '#fff', border: 'none' }}>
            Hủy
          </button>
        )}
      </form>

      {/* Danh sách hiển thị sinh viên */}
      <h2 style={{ textAlign: 'center' }}>Danh Sách Sinh Viên</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {students.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa' }}>Chưa có sinh viên nào trong danh sách.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {students.map((st) => (
              <li 
                key={st._id} 
                style={{ backgroundColor: '#2d2d2d', padding: '12px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <strong>{st.studentId}</strong> - {st.name} ({st.email})
                </div>
                <div>
                  <button onClick={() => handleEdit(st)} style={{ marginRight: '8px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '3px' }}>
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(st._id)} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '3px' }}>
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;