const nodemailer=require('nodemailer');
const passport = require("passport");
exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizer = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'sukrajchaudhary90@gmail.com',
    pass: 'bfl vnfdy yanv hmbw'
  }
});

exports.Mailsend=async function ({to,subject,text,html}){
     let info = await transporter.sendMail({
       from: '"Ecommerce👻" <sukraj@ecomerce.com>', // sender address
       to,// list of receivers
       secureProtocol: 'TLSv1_2_method',
       subject, // Subject line
       text, // plain text body
       html, // html body
     });
   return info;
}

