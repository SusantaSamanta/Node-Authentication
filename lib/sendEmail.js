

const emailSendUrl = process.env.SENDMAILURL;

export const sendEmail = async (to, subject, html) => {
    console.log(emailSendUrl)
    console.log("Sending email to :", to)
    try {
        const res = await fetch(emailSendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to,
                subject,
                html,
                admin: process.env.SENDMAILADMINPASSWORD,
            }),
        });
        
        // console.log(await res.json());
        
        if (!res.ok) {
            return false;
        }
        
        
        console.log("Email sended to :", to)
        return await res.json();

    } catch (error) {
        console.log("Failed to send email :", to)
        return false;
    }
};
