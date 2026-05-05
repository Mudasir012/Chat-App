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
