const nodemailer = require("nodemailer");

// @desc    Send resume via email
// @route   POST /api/email/share-resume
// @access  Private
const shareResume = async (req, res) => {
  try {
    const { recipientEmail, subject, message, resumeId, resumeTitle } =
      req.body;

    // Validate required fields
    if (!recipientEmail || !subject || !message || !resumeId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Create transporter (you'll need to configure this with your email service)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Generate the public resume link
    const publicLink = `${process.env.FRONTEND_URL}/resume/${resumeId}/preview`;

    // Create email content
    const emailContent = `
      ${message}
      
      ---
      Resume Link: ${publicLink}
      Resume Title: ${resumeTitle || "My Resume"}
      
      This resume was shared with you via Resume Builder.
    `;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Resume Shared</h2>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <hr>
          <p><strong>Resume Link:</strong> <a href="${publicLink}">${publicLink}</a></p>
          <p><strong>Resume Title:</strong> ${resumeTitle || "My Resume"}</p>
          <p style="color: #666; font-size: 12px;">
            This resume was shared with you via Resume Builder.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again.",
    });
  }
};

module.exports = {
  shareResume,
};
