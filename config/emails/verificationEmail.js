export const verificationEmail = (token) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to H&M!</title>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f8f9fa;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 50px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .logo {
        display: block;
        margin: 0 auto;
        width: 150px;
      }
      .heading {
        text-align: center;
        margin-top: 20px;
        color: #333;
        font-size: 28px;
        border-bottom: 1px solid #cacaca;
        padding-bottom: 10px;
      }
      .content {
        margin-top: 20px;
        font-size: 16px;
        line-height: 1.6;
        color: #666;
      }
      .btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        text-align: center;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
        font-size: 16px;
        transition: background-color 0.3s ease;
      }
      .btn:hover {
        background-color: #0056b3;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #999;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1 class="heading">Welcome to H&M</h1>
      <p class="content">
        You're just a click away from unlocking a treasure trove of powerful
        APIs.
      </p>
      <p class="content">
        Please click the following link to verify your email address:
      </p>
      <a href="http://localhost:8080/api/v1/verify-email/${token}" class="btn"
        >Verify Email</a
      >
      <p class="content">
        Once you verify your account, you may login to view your account status,
        API usage activity, and account settings.
      </p>
      <p class="footer">
        Best regards,<br />
        The H&M Team
      </p>
    </div>
  </body>
</html>
`;
}