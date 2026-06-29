import React, { useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbaa2NNHOf_Zg_AcNamRoByUqkwMwYXvo",
  authDomain: "project-enet-c.firebaseapp.com",
  projectId: "project-enet-c",
  storageBucket: "project-enet-c.firebasestorage.app",
  messagingSenderId: "818148441563",
  appId: "1:818148441563:web:a4471a1ca94f8cee847bfe",
  measurementId: "G-RQ2RBKCJG1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ⚠️ เอาลิงก์ Web app URL ที่ได้จาก Google Apps Script ในขั้นตอนที่ 1 มาวางตรงนี้ครับ
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwFwV5dFDQMDNrwbd2MhEMJZI5cIkJ45M_h3BCH4V-FKkPTAjTPSGxyu2JAD-FL1LKw/exec";

function RegisterForm() {
  const [name, setName] = useState('');       
  const [jobRole, setJobRole] = useState(''); 
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [loading, setLoading] = useState(false); 
  const [submissionResult, setSubmissionResult] = useState('');

  const fileInputRef = useRef(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file)); 
    }
  };

  // ฟังก์ชันแปลงไฟล์เป็น Base64 เพื่อให้ส่งผ่าน API ได้ง่าย
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("กรุณาเลือกหรือถ่ายวิดีโอก่อนส่งประเมินผล");
      return;
    }

    try {
      setLoading(true);
      setSubmissionResult('กำลังอัปโหลดวิดีโอเข้า Google Drive... (ขั้นตอนนี้อาจใช้เวลาสักครู่)');
      console.log("🚀 เริ่มต้นกระบวนการส่งวิดีโอไป Google Drive...");

      // 1. แปลงไฟล์วิดีโอเป็น Base64
      const base64Data = await convertFileToBase64(videoFile);
      const fileExtension = videoFile.name.split('.').pop();
      const fileName = `${Date.now()}_${name}.${fileExtension}`;

      // 2. ส่งไฟล์ไปที่ Google Apps Script หลังบ้าน
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify({
          fileName: fileName,
          mimeType: videoFile.type,
          fileBase64: base64Data
        })
      });

      const result = await response.json();

      if (result.status !== 'success') {
        throw new Error(result.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์ไป Google Drive');
      }

      const driveDownloadURL = result.videoUrl;
      console.log("✅ วิดีโอเข้า Google Drive ของคุณสำเร็จแล้ว! ลิงก์คือ:", driveDownloadURL);
      setSubmissionResult('บันทึกวิดีโอสำเร็จ! กำลังบันทึกข้อมูลฟอร์มลงคอลเลกชัน assessments ใน Firestore...');

      // 3. นำข้อมูลฟอร์มและลิงก์ Google Drive ไปหยอดลง Firestore
      console.log("📝 กำลังบันทึกเอกสารลง Firestore...");
      await addDoc(collection(db, 'assessments'), {
        name,
        job_role: jobRole,
        line_user_id: "TEST_USER_" + Date.now(), 
        video_url: driveDownloadURL, // หยอดลิงก์ Google Drive เข้าคอลเลกชัน
        final_reba_score: 0,
        risk_level: "กำลังประเมินผล (Test - Google Drive Backend)",
        risk_details: {
          legs: "", lower_arms: "", neck: "", trunk: "", upper_arms: "", wrists: ""
        },
        timestamp: serverTimestamp() 
      });

      console.log("🎉 บันทึกข้อมูลลงฐานข้อมูลและไดรฟ์สำเร็จทั้งหมด!");
      setSubmissionResult(`ส่งข้อมูลและวิดีโอของ คุณ ${name} สำเร็จเรียบร้อยแล้ว ✨`);
      alert(`บันทึกข้อมูลสำเร็จ! วิดีโออัปโหลดเข้า Google Drive และข้อมูลบันทึกเข้า Firestore แล้ว`);
      
      // ล้างค่าในฟอร์ม
      setName('');
      setJobRole('');
      setVideoFile(null);
      setVideoPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error("🔥 เกิดข้อผิดพลาด:", error);
      setSubmissionResult(`เกิดข้อผิดพลาด: ${error.message}`);
      alert(`เกิดข้อผิดพลาด! กรุณาตรวจดูลิงก์ Google Apps Script หรือขนาดไฟล์วิดีโอของคุณ`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.cardContainer}>
        
        <h2 style={styles.mainTitle}>ลงทะเบียนประเมินผล</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>ชื่อ-นามสกุล</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                style={styles.input}
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ประเภทลักษณะงาน</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🛠️</span>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                required
                disabled={loading}
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

          <div style={styles.inputGroup}>
            <label style={styles.label}>วิดีโอสำหรับการประเมิน</label>
            <input 
              type="file" 
              accept="video/*" 
              ref={fileInputRef}
              onChange={handleVideoChange}
              disabled={loading}
              style={{ display: 'none' }} 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
              style={styles.uploadBtn}
            >
              🎥 ถ่ายวิดีโอสด หรือ เลือกคลิปจากเครื่อง
            </button>
          </div>

          {videoPreview && (
            <div style={styles.previewContainer}>
              <p style={styles.previewText}>ตัวอย่างวิดีโอของคุณ:</p>
              <video src={videoPreview} controls style={styles.previewVideo} />
            </div>
          )}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'กำลังส่งข้อมูล... ⏳' : 'ส่งข้อมูลประเมิน'} 
            {!loading && <span style={{ marginLeft: '8px' }}>→</span>}
          </button>

          {submissionResult && (
            <div style={styles.successMessage}>{submissionResult}</div>
          )}

        </form>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: { backgroundColor: '#f4f5f4', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' },
  cardContainer: { backgroundColor: '#ffffff', width: '100%', maxWidth: '440px', borderRadius: '40px', padding: '40px 30px', boxSizing: 'border-box', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  mainTitle: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 20px 0', color: '#1a1a1a' },
  inputGroup: { marginBottom: '20px' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333333', display: 'block', marginBottom: '8px', paddingLeft: '4px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '16px', fontSize: '16px', color: '#666' },
  input: { width: '100%', padding: '16px 16px 16px 45px', borderRadius: '20px', border: '1px solid #eef0ee', backgroundColor: '#f9faf9', fontSize: '15px', color: '#333', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '16px 16px 16px 45px', borderRadius: '20px', border: '1px solid #eef0ee', backgroundColor: '#f9faf9', fontSize: '15px', color: '#333', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', WebkitAppearance: 'none' },
  uploadBtn: { width: '100%', padding: '14px', backgroundColor: '#ffffff', color: '#555555', border: '2px dashed #76cb00', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxSizing: 'border-box' },
  previewContainer: { marginBottom: '20px', textAlign: 'center' },
  previewText: { fontSize: '13px', color: '#666', margin: '0 0 6px 0' },
  previewVideo: { width: '100%', maxHeight: '200px', borderRadius: '20px', backgroundColor: '#000' },
  submitBtn: { width: '100%', padding: '16px', backgroundColor: '#76cb00', color: 'white', border: 'none', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 4px 12px rgba(118, 203, 0, 0.2)', marginTop: '10px' },
  successMessage: { marginTop: '16px', padding: '14px', backgroundColor: '#e9f7ef', border: '1px solid #b7ebc6', color: '#1f7a34', borderRadius: '18px', textAlign: 'center', fontWeight: '600' }
};

export default RegisterForm;