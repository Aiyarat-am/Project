import React, { useState, useRef } from 'react';

function RegisterForm() {
  // ข้อมูลและ Logic เหมือนเดิมทุกประการ ห้ามเปลี่ยน
  const [name, setName] = useState('');       
  const [jobRole, setJobRole] = useState(''); 
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  const fileInputRef = useRef(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`บันทึกข้อมูลของ คุณ ${name} เรียบร้อย!`);
    console.log("--- ข้อมูลที่ส่ง ---");
    console.log("ชื่อ:", name);
    console.log("สายงาน:", jobRole);
    console.log("ไฟล์วิดีโอ:", videoFile);
  };

  return (
    // ตัวพื้นหลังคลุมทั้งหมด (สไตล์มินิมอล สีเทาอ่อนแบบในรูป)
    <div style={styles.pageBackground}>
      <div style={styles.cardContainer}>
        
        {/* โลโก้รูปบวกสีเขียวแบบในภาพตัวอย่าง */}


        {/* หัวข้อสไตล์แบบในรูป */}
        <h2 style={styles.mainTitle}>ลงทะเบียน</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* 1. ช่องกรอกชื่อ-นามสกุล */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>ชื่อ-นามสกุล</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>
          </div>

          {/* 2. Dropdown เลือกประเภทลักษณะงาน */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>ประเภทลักษณะงาน</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🛠️</span>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                required
                style={styles.select}
              >
                <option value="">-- เลือกประเภทงานช่าง --</option>
                <option value="ช่างเชื่อม">ช่างเชื่อม</option>
                <option value="ช่างเคาะ">ช่างประกอบ/ช่างเคาะ</option>
                <option value="ช่างเจียร">ช่างเจียร/ตัดเหล็ก</option>
                <option value="ช่างสี">ช่างพ่นสี/พ่นทราย</option>
              </select>
            </div>
          </div>

          {/* 3. ปุ่มเปิดกล้อง/อัปโหลดวิดีโอ */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>วิดีโอสำหรับการประเมิน</label>
            <input 
              type="file" 
              accept="video/*" 
              ref={fileInputRef}
              onChange={handleVideoChange}
              style={{ display: 'none' }} 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              style={styles.uploadBtn}
            >
              🎥 ถ่ายวิดีโอสด หรือ เลือกคลิปจากเครื่อง
            </button>
          </div>

          {/* หน้าจอแสดงวิดีโอตัวอย่าง ดีไซน์โค้งมนเข้ากับธีม */}
          {videoPreview && (
            <div style={styles.previewContainer}>
              <p style={styles.previewText}>ตัวอย่างวิดีโอของคุณ:</p>
              <video src={videoPreview} controls style={styles.previewVideo} />
            </div>
          )}

          {/* ปุ่มส่งฟอร์ม สีเขียวสดใสพร้อมลูกศรแบบในรูป */}
          <button type="submit" style={styles.submitBtn}>
            บันทึกข้อมูล <span style={{ marginLeft: '8px' }}>→</span>
          </button>

        </form>
      </div>
    </div>
  );
}

// === สไตล์ CSS-in-JS ถอดแบบมาจากรูปภาพตัวอย่าง ===
const styles = {
  pageBackground: {
    backgroundColor: '#f4f5f4',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box'
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '440px',
    borderRadius: '40px', // โค้งมนละมุนแบบในรูป
    padding: '40px 30px',
    boxSizing: 'border-box',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  logoCenter: {
    position: 'relative',
    width: '36px',
    height: '36px'
  },
  logoDot: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    backgroundColor: '#76cb00', // สีเขียวจากในรูป
    borderRadius: '4px'
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0 0 8px 0',
    color: '#1a1a1a'
  },
  subTitle: {
    fontSize: '14px',
    color: '#7a7a7a',
    textAlign: 'center',
    margin: '0 0 30px 0'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333333',
    display: 'block',
    marginBottom: '8px',
    paddingLeft: '4px'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '16px',
    color: '#666'
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 45px', // เว้นซ้ายให้ไอคอน
    borderRadius: '20px', // ดีไซน์ขอบมนเด่นชัด
    border: '1px solid #eef0ee',
    backgroundColor: '#f9faf9',
    fontSize: '15px',
    color: '#333',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '16px 16px 16px 45px',
    borderRadius: '20px',
    border: '1px solid #eef0ee',
    backgroundColor: '#f9faf9',
    fontSize: '15px',
    color: '#333',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    WebkitAppearance: 'none', // ซ่อนลูกศรเดิมเพื่อให้เข้ากับดีไซน์
  },
  uploadBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#ffffff',
    color: '#555555',
    border: '2px dashed #76cb00', // ใช้เส้นประสีเขียวให้รู้ว่าเป็นจุดอัปโหลด
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  previewContainer: {
    marginBottom: '20px',
    textAlign: 'center'
  },
  previewText: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 6px 0'
  },
  previewVideo: {
    width: '100%',
    maxHeight: '200px',
    borderRadius: '20px',
    backgroundColor: '#000'
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#76cb00', // สีเขียวสดตัวเดียวกับปุ่ม Sign In ในรูป
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(118, 203, 0, 0.2)',
    marginTop: '10px'
  }
};

export default RegisterForm;