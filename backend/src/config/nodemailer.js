import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "arshdeepchhabra1712@gmail.com",
                pass: "hmgrwmqtkalfwtru"
            },
        })

export const verifyEmail = async (email, token, name) => {
    try {
        const mailConfiguration = {
            from: "arshdeepchhabra1712@gmail.com",
            to: email,
            subject: `Welcome ${name}`,
            text: `Your account has been created with id : ${email}`
        };        
        transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP error:", error);
            } else {
                console.log("SMTP server is ready to send messages");
            }
        });
        await transporter.sendMail(mailConfiguration);
    } catch (error) {
        throw error
    }
};
export const sendOtpEmail = async (email, otp, name) => {
  try {
    const mailConfigurationOTP = {
      from: "arshdeepchhabra1712@gmail.com",
      to: email,
      subject: `Hi ${name}, Your OTP Code`,
      text: `Hello ${name},\n\nYour OTP code is: ${otp}\nIt will expire in 24 hours.\n\nIf you did not request this, ignore this email.`
    };
    transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP error:", error);
            } else {
                console.log("SMTP server is ready to send messages");
            }
        });
    await transporter.sendMail(mailConfigurationOTP);
  } catch (error) {
    throw error;
  }
};
export const resetOtpEmail = async (email, otp, name) => {
  try {
    const mailConfigurationOTP = {
      from: "arshdeepchhabra1712@gmail.com",
      to: email,
      subject: `Hi ${name}, Your OTP Code to reset your password`,
      text: `Hello ${name},\n\nYour OTP code is: ${otp}\nIt will expire in 15 minutes.\n\nIf you did not request this, ignore this email.`
    };
    transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP error:", error);
            } else {
                console.log("SMTP server is ready to send messages");
            }
        });
    await transporter.sendMail(mailConfigurationOTP);
  } catch (error) {
    throw error;
  }
};