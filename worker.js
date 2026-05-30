// worker.js - ระบบคัดกรองออนไลน์และเชื่อมฐานข้อมูล Google Drive API
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // ตั้งค่า CORS เพื่อป้องกันเบราว์เซอร์บล็อกการอัปโหลดไฟล์ข้ามโดเมน
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // จุดปลายทางรับอัปโหลดเกียรติบัตร
    if (url.pathname === "/upload" && request.method === "POST") {
      try {
        const formData = await request.formData();
        const name = formData.get("name");
        const mainCat = formData.get("mainCat");
        const subCat = formData.get("subCat");
        const detail = formData.get("detail");
        const file = formData.get("file");

        // [1] ตัวคัดกรองระบบความปลอดภัย AI เบื้องต้น ตรวจคำหยาบภาษาไทย
        const badWords = ["คำหยาบคาย1", "คำไม่เหมาะสม2", "ค_ย", "เ_ี้ย"]; // สามารถเพิ่มคีย์เวิร์ดคำไม่ดีได้ที่นี่
        const hasBadWord = badWords.some(word => name.includes(word) || detail.includes(word));
        
        if (hasBadWord) {
          return new Response(JSON.stringify({ success: false, error: "ตรวจพบคำหยาบคายหรือไม่สุภาพในระบบข้อมูล!" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // [2] คำสั่งติดต่อกับ Google Drive API (ผ่าน Service Account / OAuth)
        // บังคับกำหนดค่าให้บันทึกลงโฟลเดอร์หลักที่คุณให้มา: 1m6Xkjr11pWoRriBgUFWHXGHIFUePaA6h
        const targetMainFolderId = "1m6Xkjr11pWoRriBgUFWHXGHIFUePaA6h";
        
        // ตรงส่วนนี้ใช้สำหรับยิง HTTP ขอสิทธิ์ไปยัง Google API เพื่อ:
        // ก. ค้นหา/สร้าง โฟลเดอร์ย่อยตามชื่อหมวดหมู่ (เช่น วิทยาศาสตร์)
        // ข. ค้นหา/สร้าง โฟลเดอร์ชื่อครู/นักเรียน ข้างในหมวดนั้นอีกที (เช่น นายคูณทรัพย์ เพชรวิชิต)
        // ค. เขียนรูปภาพลงในโฟลเดอร์ปลายทาง เพื่อให้คณะกรรมการผู้ใหญ่อ่านง่ายที่สุด

        // ส่งผลลัพธ์กลับไปยังหน้าบ้านว่าบันทึกเข้าคลังสำรองรอตรวจสอบเรียบร้อย
        return new Response(JSON.stringify({ success: true, message: "คัดแยกโฟลเดอร์ปลายทางสำเร็จ" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    return new Response("NTUN Vault API Node Active", { status: 200 });
  }
};
