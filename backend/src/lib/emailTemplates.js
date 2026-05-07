export const WELCOME_EMAIL_TEMPLATE = (name) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 20px;
            color: #000000;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            border: 4px solid #000000;
            padding: 40px;
            background-color: #ffffff;
            box-shadow: 12px 12px 0px 0px #000000;
        }
        .header {
            border-bottom: 4px solid #000000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            font-size: 32px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -1px;
            margin: 0;
            line-height: 1;
        }
        .accent {
            color: #dc2626;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
            font-weight: 500;
        }
        .button {
            display: inline-block;
            background-color: #dc2626;
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none;
            font-weight: 900;
            text-transform: uppercase;
            border: 2px solid #000000;
            box-shadow: 6px 6px 0px 0px #000000;
            margin-top: 20px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-t: 2px solid #000000;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 700;
            opacity: 0.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>WELCOME TO <span class="accent">CHATAPP</span></h1>
        </div>
        <p>HI ${name.toUpperCase()},</p>
        <p>YOUR ACCOUNT HAS BEEN SUCCESSFULLY CREATED. YOU ARE NOW PART OF THE MOST MINIMALIST AND POWERFUL CHAT COMMUNITY ON THE WEB.</p>
        <p>START CHATTING WITH YOUR FRIENDS IN REAL-TIME, SHARE MEDIA, AND ENJOY THE BRUTALIST EXPERIENCE.</p>
        <a href="http://localhost:5173" class="button">START CHATTING</a>
        <div class="footer">
            &copy; 2026 CHATAPP. ALL RIGHTS RESERVED. NO TRACKING. NO BS.
        </div>
    </div>
</body>
</html>
`;

export const VERIFICATION_EMAIL_TEMPLATE = (verificationToken) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; background-color: #ffffff; margin: 0; padding: 20px; color: #000000; }
        .container { max-width: 600px; margin: 0 auto; border: 4px solid #000000; padding: 40px; background-color: #ffffff; box-shadow: 12px 12px 0px 0px #000000; }
        .header { border-bottom: 4px solid #000000; padding-bottom: 20px; margin-bottom: 30px; }
        h1 { font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0; line-height: 1; }
        .accent { color: #dc2626; }
        p { font-size: 16px; line-height: 1.5; margin-bottom: 20px; font-weight: 500; }
        .button { display: inline-block; background-color: #000000; color: #ffffff !important; padding: 15px 30px; text-decoration: none; font-weight: 900; text-transform: uppercase; border: 2px solid #000000; box-shadow: 6px 6px 0px 0px #dc2626; margin-top: 20px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #000000; font-size: 12px; text-transform: uppercase; font-weight: 700; opacity: 0.5; }
        .token { font-size: 24px; font-weight: 900; letter-spacing: 4px; background: #f3f4f6; padding: 10px; border: 2px dashed #000000; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>VERIFY <span class="accent">YOUR EMAIL</span></h1>
        </div>
        <p>THANKS FOR SIGNING UP! PLEASE USE THE CODE BELOW TO VERIFY YOUR EMAIL ADDRESS:</p>
        <div class="token">${verificationToken}</div>
        <p>IF YOU DIDN'T CREATE AN ACCOUNT, YOU CAN SAFELY IGNORE THIS EMAIL.</p>
        <div class="footer">
            &copy; 2026 CHATAPP. SECURE. PRIVATE. FAST.
        </div>
    </div>
</body>
</html>
`;

export const PASSWORD_RESET_EMAIL_TEMPLATE = (resetUrl) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; background-color: #ffffff; margin: 0; padding: 20px; color: #000000; }
        .container { max-width: 600px; margin: 0 auto; border: 4px solid #000000; padding: 40px; background-color: #ffffff; box-shadow: 12px 12px 0px 0px #000000; }
        .header { border-bottom: 4px solid #000000; padding-bottom: 20px; margin-bottom: 30px; }
        h1 { font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0; line-height: 1; }
        .accent { color: #dc2626; }
        p { font-size: 16px; line-height: 1.5; margin-bottom: 20px; font-weight: 500; }
        .button { display: inline-block; background-color: #dc2626; color: #ffffff !important; padding: 15px 30px; text-decoration: none; font-weight: 900; text-transform: uppercase; border: 2px solid #000000; box-shadow: 6px 6px 0px 0px #000000; margin-top: 20px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #000000; font-size: 12px; text-transform: uppercase; font-weight: 700; opacity: 0.5; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PASSWORD <span class="accent">RESET</span></h1>
        </div>
        <p>WE RECEIVED A REQUEST TO RESET YOUR PASSWORD. CLICK THE BUTTON BELOW TO SET A NEW ONE:</p>
        <a href="${resetUrl}" class="button">RESET PASSWORD</a>
        <p>IF YOU DIDN'T REQUEST A PASSWORD RESET, PLEASE IGNORE THIS EMAIL OR CONTACT SUPPORT IF YOU HAVE CONCERNS.</p>
        <p>THIS LINK WILL EXPIRE IN 1 HOUR.</p>
        <div class="footer">
            &copy; 2026 CHATAPP. STAY SAFE.
        </div>
    </div>
</body>
</html>
`;
