// app/api/enquiries/route.ts
import { NextResponse } from "next/server";
import Enquiry from "@/models/Enquiry";
import nodemailer from "nodemailer";
import { connectToDb } from "@/lib/mongodb";
import { format } from "date-fns";

interface EnquiryIF {
  name: string
  message: string
  phone: string
  email: string
}


// Email-safe template function (Gmail/Outlook compatible)
function createEmailSafeTemplate(enquiry: EnquiryIF, formattedDate: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Enquiry Notification</title>
    <style>
        /* Email-safe CSS - No flexbox, gradients, or advanced features */
        body {
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #101c16;
            background-color: #f0f9ef;
            margin: 0;
            padding: 0;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
        }
        
        .main-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .header {
            background-color: #101c16;
            padding: 30px 20px;
            text-align: center;
            color: #ffffff;
        }
        
        .header h1 {
            color: #ffffff;
            font-size: 26px;
            font-weight: bold;
            margin: 0 0 10px 0;
        }
        
        .header p {
            color: #c7e6c4;
            font-size: 16px;
            margin: 0;
        }
        
        .notification-badge {
            background-color: #2d5a3d;
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
            display: inline-block;
        }
        
        .content {
            padding: 25px 20px;
        }
        
        .alert-box {
            background-color: #e5f4e3;
            border: 2px solid #4a7c59;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .alert-text {
            color: #1a2d20;
            font-weight: bold;
            font-size: 14px;
            margin: 0;
        }
        
        .details-container {
            background-color: #f8fcf7;
            border-radius: 8px;
            border: 1px solid #d4edcf;
            overflow: hidden;
        }
        
        .detail-row {
            padding: 18px 20px;
            border-bottom: 1px solid #d4edcf;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-size: 12px;
            font-weight: bold;
            color: #4a7c59;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        
        .detail-value {
            font-size: 16px;
            font-weight: bold;
            color: #101c16;
            word-wrap: break-word;
        }
        
        .detail-value a {
            color: #2d5a3d;
            text-decoration: underline;
        }
        
        .message-box {
            background-color: #ffffff;
            border: 1px solid #c7e6c4;
            border-radius: 5px;
            padding: 15px;
            font-size: 15px;
            line-height: 1.5;
            color: #2d5a3d;
            margin-top: 5px;
        }
        
        .timestamp-badge {
            background-color: #e5f4e3;
            color: #1a3d26;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 8px;
            display: inline-block;
        }
        
        .footer {
            background-color: #f8fcf7;
            padding: 25px 20px;
            text-align: center;
            border-top: 1px solid #d4edcf;
        }
        
        .footer-text {
            font-size: 14px;
            color: #4a7c59;
            margin: 0 0 15px 0;
            line-height: 1.4;
        }
        
        .cta-button {
            background-color: #2d5a3d;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 14px;
            display: inline-block;
            border: none;
        }
        
        .icon-cell {
            width: 50px;
            vertical-align: top;
            padding-right: 15px;
        }
        
        .icon-box {
            width: 40px;
            height: 40px;
            background-color: #52b788;
            border-radius: 8px;
            text-align: center;
            line-height: 40px;
            font-size: 18px;
            color: #ffffff;
        }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
            .main-container {
                width: 95% !important;
                margin: 10px auto !important;
            }
            
            .header {
                padding: 20px 15px !important;
            }
            
            .header h1 {
                font-size: 22px !important;
            }
            
            .content {
                padding: 20px 15px !important;
            }
            
            .detail-row {
                padding: 15px !important;
            }
        }
    </style>
</head>
<body>
    <div style="padding: 20px;">
        <table class="main-container" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td class="header">
                    <div class="notification-badge">
                        🔔 New Enquiry Alert
                    </div>
                    <h1>📩 Callback Request</h1>
                    <p>You have received a new customer enquiry</p>
                </td>
            </tr>
            
            <tr>
                <td class="content">
                    <div class="alert-box">
                        <p class="alert-text">
                            ⚠️ <strong>Action Required:</strong> A potential customer is waiting for your response.
                        </p>
                    </div>
                    
                    <div class="details-container">
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                <td class="detail-row">
                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                        <tr>
                                            <td class="icon-cell">
                                                <div class="icon-box">👤</div>
                                            </td>
                                            <td>
                                                <div class="detail-label">Customer Name</div>
                                                <div class="detail-value">${enquiry.name}</div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td class="detail-row">
                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                        <tr>
                                            <td class="icon-cell">
                                                <div class="icon-box">📧</div>
                                            </td>
                                            <td>
                                                <div class="detail-label">Email Address</div>
                                                <div class="detail-value">
                                                    <a href="mailto:${enquiry.email}">${enquiry.email}</a>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td class="detail-row">
                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                        <tr>
                                            <td class="icon-cell">
                                                <div class="icon-box">📱</div>
                                            </td>
                                            <td>
                                                <div class="detail-label">Phone Number</div>
                                                <div class="detail-value">${enquiry.phone}</div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td class="detail-row">
                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                        <tr>
                                            <td class="icon-cell">
                                                <div class="icon-box">💬</div>
                                            </td>
                                            <td>
                                                <div class="detail-label">Message</div>
                                                <div class="detail-value">
                                                    <div class="message-box">
                                                        ${enquiry.message || 'No message provided'}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td class="detail-row">
                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                        <tr>
                                            <td class="icon-cell">
                                                <div class="icon-box">🕐</div>
                                            </td>
                                            <td>
                                                <div class="detail-label">Submitted At</div>
                                                <div class="detail-value">
                                                    ${formattedDate}
                                                    <br>
                                                    <span class="timestamp-badge">
                                                        ⏰ New enquiry received
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
            
            <tr>
                <td class="footer">
                    <p class="footer-text">
                        This enquiry was submitted through your website contact form.<br>
                        Please respond promptly to maintain customer satisfaction.
                    </p>
                    <a href="mailto:${enquiry.email}" class="cta-button">
                        📧 Reply to Customer
                    </a>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
  `;
}

export async function POST(req: Request) {
  try {
    await connectToDb();

    const body = await req.json();
    const { name, email, phone, message } = body;

    // 1️⃣ Save enquiry in DB
    const enquiry = await Enquiry.create({ name, email, phone, message });

    // 2️⃣ Respond immediately (so user doesn't wait for email)
    const response = NextResponse.json({ success: true, enquiry });

    // 3️⃣ Prepare mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 4️⃣ Send email-safe template
    const formattedDate = format(enquiry.createdAt, "dd MMM yyyy, hh:mm a");
    const emailHtml = createEmailSafeTemplate(enquiry, formattedDate);

    transporter
      .sendMail({
        from: `"Website Enquiry" <${process.env.SMTP_USER}>`,
        to: 'hr@staarllet.com',
        subject: "🚀 New Customer Enquiry - Action Required",
        html: emailHtml,
      })
      .catch((err) => {
        console.error("❌ Failed to send enquiry email:", err);
      });

    return response;
  } catch (error) {
    console.error("❌ Error saving enquiry:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDb();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("❌ Error fetching enquiries:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}