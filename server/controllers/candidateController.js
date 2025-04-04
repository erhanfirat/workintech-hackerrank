const Candidate = require("../db/CandidateModel");
const Student = require("../db/StudentModel");
const Test = require("../db/TestModel");
const Motivation = require("../db/MotivationModel");
const pdf = require("pdf-parse");
const axios = require("axios");
const { sendEmail } = require("../utils/utils");

// Aday sonuçlarını getir
exports.getStudentResults = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    // Öğrencinin tüm sınav sonuçlarını getir
    const results = await Candidate.getCandidatesByStudentId(studentId);
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

// PDF raporlarını gönder
exports.sendReports = async (req, res, next) => {
  try {
    const reports = req.body;
    const results = [];

    for (let i = 0; i < reports.length; i++) {
      const { url, studentId, testId } = reports[i];

      // PDF'i URL'den indir
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const pdfBuffer = Buffer.from(response.data);

      const student = await Student.getStudentById(studentId);
      const test = await Test.getTestById(testId);
      const motivation = await Motivation.getMotivation();

      // PDF'i parse et
      const data = await pdf(pdfBuffer);

      if (student && test) {
        // Ek dosya oluştur
        const attachment = {
          filename: `${test.name} - ${student.name}.pdf`,
          content: pdfBuffer,
        };

        const subject = `${test.name} Sınav Değerlendirme Raporun Hazır!`;
        const content = `
<div style="font-size: 18px;">
  <p>Merhaba <strong>${student.name};</strong></p>

  <p>
    <strong>${test.name}</strong> sınav değerlendirme PDF dosyası maile eklenmiştir.
    Bu rapor doğru ve hatalı cevaplarını inceleyip, hatalarını tespit edip, bilgilerini tazelemek için mükemmel bir fırsat.
  </p>

  Workintech <br />
  Hackerrank Ekibi

  <blockquote style="padding-top: 30px;">
    <q>${motivation.word}</q>
    <br />
    ${motivation.author}
  </blockquote>
</div>
`;

        // E-posta gönder
        await sendEmail(student.hrEmail || student.email, subject, content, [
          attachment,
        ]);

        results.push(
          `PDF Email sent to ${student.name} | ${
            student.hrEmail || student.email
          }`
        );
      } else {
        // Öğrenci veya test bulunamadı
        console.error(
          "Bu adayla ilgili öğrenci veya test kaydı yok: ",
          { studentId, testId },
          student
        );
        results.push(
          `Bu öğrenci ID: ${studentId} && test ID: ${testId} ile ilgili kayıt bulunamadı > öğrenci: ${JSON.stringify(
            student
          )} && test: ${JSON.stringify(test)}`
        );
      }
    }

    res.json({
      message:
        "PDF indirme ve e-posta gönderme işlemi başarıyla tamamlandı. Her öğrenci için sonuç raporunu kontrol edin! Bazılarında sorun olabilir!",
      results,
    });
  } catch (err) {
    next(err);
  }
};
