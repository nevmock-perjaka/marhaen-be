function generateVerifEmail(otp) {
	return `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Urbanist&display=swap" rel="stylesheet">
    <title>Verification Code - Marhaen</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Urbanist';
        background-color: #f8f9fa;
        color: #333;
        line-height: 1.6;
        padding: 20px;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }

      .header {
        padding: 30px 40px 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      .logo-image {
        max-height: 50px;
        height: auto;
        max-width: 300px;
        width: auto;
      }

      .content {
        padding: 40px;
      }

      .title {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        margin-bottom: 30px;
      }

      .greeting {
        font-size: 16px;
        color: #555;
        margin-bottom: 8px;
      }

      .description {
        font-size: 16px;
        color: #666;
        margin-bottom: 40px;
      }

      .code-container {
        background-color: #f0f8f0;
        border-radius: 8px;
        padding: 30px;
        text-align: center;
        margin-bottom: 40px;
        border: 1px solid #e8f5e8;
      }

      .verification-code {
        font-size: 36px;
        font-weight: 600;
        color: #4caf50;
        letter-spacing: 4px;
      }

      .footer-text {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
      }

      .team-signature {
        font-size: 14px;
        color: #666;
        margin-bottom: 30px;
      }

      .disclaimer {
        font-size: 12px;
        color: #999;
        font-style: italic;
        margin-bottom: 30px;
      }

      .bottom-section {
        background-color: #4caf50;
        padding: 0;
        text-align: center;
      }

      .green-bar {
        height: 4px;
        background-color: #4caf50;
        width: 100%;
      }

      .help-section {
        background-color: white;
        padding: 25px 40px;
        text-align: center;
      }

      .help-text {
        color: #666;
        font-size: 14px;
        margin: 0;
      }

      .help-link {
        color: #4a90e2;
        text-decoration: none;
      }

      .help-link:hover {
        text-decoration: underline;
      }

      .validity-highlight {
        font-weight: 600;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .container {
          margin: 10px;
          border-radius: 8px;
        }

        .header,
        .content {
          padding: 20px;
        }

        .help-section {
          padding: 20px;
        }

        .title {
          font-size: 24px;
        }

        .verification-code {
          font-size: 28px;
          letter-spacing: 2px;
        }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img
        src="${process.env.BE_URL}/assets/images/logo.png"
        alt="Marhaen Digital Cashier"
        class="logo-image"
      />
    </div>

    <div class="content">
      <h1 class="title">Verification Code</h1>

      <p class="greeting">Hi Nida Almaya,</p>

      <p class="description">
        Here's your verification code. It's valid for the next
        <span class="validity-highlight">5 minutes</span>.
      </p>

      <div class="code-container">
        <div class="verification-code">${otp}</div>
      </div>

      <p class="footer-text">Thanks,</p>
      <p class="team-signature">The Marhaen Team</p>

      <p class="disclaimer">
        Didn't request this code? Just ignore this email, no action needed.
      </p>
    </div>

    <div class="bottom-section">
      <div class="green-bar"></div>
      <div class="help-section">
        <p class="help-text">
          Need help? Contact us at
          <a href="mailto:help@marhaen.com" class="help-link"
            >help@marhaen.com</a
          >
        </p>
      </div>
    </div>
  </body>
</html>
    `;
}

export { generateVerifEmail };
