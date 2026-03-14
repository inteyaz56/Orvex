import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOtp = async (email, otp) => {
  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "Orvex",
      },

      to: [{ email }],

      subject: "Your Orvex OTP Code",

      htmlContent: `
      <div style="
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 20px;
        background-color: #f4f4f4;
      ">
        <div style="
          max-width: 400px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        ">
          <h2 style="color:#333;">Orvex Verification</h2>

          <p style="font-size:16px;">
            Use the OTP below to complete your signup
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #4CAF50;
            margin: 20px 0;
          ">
            ${otp}
          </div>

          <p style="color:#777;">
            This OTP expires in <b>5 minutes</b>
          </p>

          <p style="font-size:12px;color:#aaa;">
            If you didn’t request this, ignore this email.
          </p>
        </div>
      </div>
      `,
    });

    return response;
  } catch (error) {
    console.log(error || "Eror");
  }
};

export const sendOtpForPassWord = async (email, otp) => {
  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "Orvex",
      },

      to: [{ email }],

      subject: "Your Orvex OTP Code For Forget Password",

      htmlContent: `
      <div style="
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 20px;
        background-color: #f4f4f4;
      ">
        <div style="
          max-width: 400px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        ">
          <h2 style="color:#333;">Orvex Verification</h2>

          <p style="font-size:16px;">
            Use the OTP below to reset your password
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #4CAF50;
            margin: 20px 0;
          ">
            ${otp}
          </div>

          <p style="color:#777;">
            This OTP expires in <b>5 minutes</b>
          </p>

          <p style="font-size:12px;color:#aaa;">
            If you didn’t request this, ignore this email.
          </p>
        </div>
      </div>
      `,
    });

    return response;
  } catch (error) {
    console.log(error || "Eror");
  }
};
