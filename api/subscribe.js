# api/subscribe.js — Newsletter endpoint (minimal)
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error:'Método no permitido'});
  res.setHeader('Access-Control-Allow-Origin','*');
  const {email} = req.body||{};
  if (!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Email inválido'});
  
  try {
    // Send notification via Gmail API
    if (process.env.GMAIL_CLIENT_ID) {
      const tr = await fetch('https://oauth2.googleapis.com/token',{method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams({client_id:process.env.GMAIL_CLIENT_ID,
          client_secret:process.env.GMAIL_CLIENT_SECRET,
          refresh_token:process.env.GMAIL_REFRESH_TOKEN,grant_type:'refresh_token'})});
      if (tr.ok) {
        const td=await tr.json();
        const subject = `=?utf-8?B?${Buffer.from(`📩 Nuevo suscriptor IA30: ${email}`).toString('base64')}?=`;
        const body = ['From: me',`To: ${process.env.NEWSLETTER_EMAIL||'nkgdario@gmail.com'}`,
          `Subject: ${subject}`,'Content-Type: text/plain; charset=utf-8','',
          `Nuevo suscriptor a IA en 30 Segundos:\n\nEmail: ${email}\nFuente: iaen30segundos.com`].join('\n');
        await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send',{method:'POST',
          headers:{Authorization:`Bearer ${td.access_token}`,'Content-Type':'application/json'},
          body:JSON.stringify({raw:Buffer.from(body).toString('base64url')})});
      }
    }
    return res.status(200).json({success:true,message:'¡Te has suscrito!'});
  } catch(e) {
    return res.status(200).json({success:true,message:'¡Te has suscrito!'});
  }
};
