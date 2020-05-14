const fs = require('fs');
const { promisify } = require('util');
const crypto = require('crypto');

const writeToFile = promisify(fs.open);
const asyncWrite = promisify(fs.write);
const asynclose = promisify(fs.close);

const makeTempPassword = (length) => {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?$&*^';
    const charactersLength = characters.length;
    const specialChars = "!#$^&*";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "1234567890"
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    result += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    result += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));

    return result;
}

const constructHTMLTemplate = (name, email, tempPassword, hash) => {

    return `
    <!DOCTYPE html>
        <!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
        <!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
        <!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
        <!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title></title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            <!--[if lt IE 7]>
                <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="#">upgrade your browser</a> to improve your experience.</p>
            <![endif]-->
            
            <h1>Hello ${name}</h1>
            <p>Thank you for signing up!</p>
            <p>Your temporary pass is ${tempPassword}</p>
            <p>You will be redirected to change it after activation</p>
            <p>click on the button below to activate your account</p>
            <button><a href="http://localhost:5100/auth/activate?id=${hash}&email=${email}&tempPass=${tempPassword}">ACTIVATE</a></button> 
        </body>
    </html>
    `
}

async function buildHTML  (req , res, next) {

    try {
        const {firstName, email } = req.body;

        const base64Hash = crypto
                        .createHmac('sha256', `${process.env.EMAIL_HASH_SECRET}`)
                        .update(email)
                        .digest('base64');
        console.log('here', base64Hash);
        const tempPassword = makeTempPassword(7);
        console.log('here', tempPassword);
        const template = constructHTMLTemplate(firstName, email, tempPassword, base64Hash);
        
        const file = await writeToFile(`./html/${base64Hash}.html`, 'w+', (err, file) => {
            return file
        });
        const write = await asyncWrite(file, template);
        const close = await asynclose(file);
        
        req.hash = base64Hash;
        console.log(template);
        next();   
    }catch(err){
        res.status(500).json({where: "BuildHTML", success: false, message: err.message, err})
    }
}

module.exports = buildHTML;