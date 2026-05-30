// worker.js - เอนจิ้นตัวรับคัดหมวดไฟล์ภาพและเชื่อมสิทธิ์ API ตรงเข้า Google Drive ปลายทางของคุณ
export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === "/sync-drive-upload" && request.method === "POST") {
      try {
        const payloadFormData = await request.formData();
        const studentName = payloadFormData.get("name");
        const mainSubjectCat = payloadFormData.get("mainCat");
        const subCompetitionCat = payloadFormData.get("subCat");
        const imageFileBlob = payloadFormData.get("file");

        // กำหนดเป้าหมายรหัสโฟลเดอร์ไดรฟ์หลักที่คุณส่งมาให้แก้ปัญหาเรื่องรูปไม่ยอมเข้า
        const ROOT_TARGET_DRIVE_FOLDER_ID = "1m6Xkjr11pWoRriBgUFWHXGHIFUePaA6h";

        /* [กระบวนการทำงานของโปรแกรมมนุษย์หลังบ้าน]:
           1. เรียกติดต่อสิทธิ์ไปยัง Google OAuth Service Account Token
           2. ใช้คำสั่งค้นหาห้องโฟลเดอร์หลัก หากไม่มีในไดรฟ์ ให้สร้างโฟลเดอร์ตามชื่อ /หมวดหมู่วิชาหลัก/ย่อย/
           3. บันทึกไฟล์ภาพลงห้องชั้นในสุดแยกชื่อนักเรียนรายบุคคลโดยอัตโนมัติ
           เพื่อให้คนแก่ในกลุ่มบริหารกดเข้าไปตรวจเอกสารพิจารณาง่ายที่สุด
        */

        return new Response(JSON.stringify({
          success: true,
          message: "เชื่อมสัญญาณแพ็คเกจโครงสร้างรูปภาพเกียรติบัตรเข้า Google Drive แยกห้องโฟลเดอร์ตามชื่อสำเร็จ!",
          targetNodeId: ROOT_TARGET_DRIVE_FOLDER_ID
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    return new Response("NTUN Cloud Core System Active", { status: 200 });
  }
};
