//import nodemailer from "nodemailer";

//const transporter = nodemailer.createTransport({
//  host: process.env.SMTP_HOST || "smtp.example.com",
//  port: process.env.SMTP_PORT || 587,
//  secure: false,
//  auth: {
//    user: process.env.SMTP_USER || "user@example.com",
//    pass: process.env.SMTP_PASS || "password",
//  },
//});

//export async function sendEmail(to, subject, htmlContent) {
//  try {
//    await transporter.sendMail({
//      from: `"SEO Monitor" <${process.env.SMTP_USER}>`,
//     to,
//      subject,
//      html: htmlContent,
//    });
//    console.log(` Email sent to ${to}`);
//  } catch (err) {
//    console.error("Email sending error:", err.message);
//}
