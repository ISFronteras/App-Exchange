const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({ origin: true });

const SENDGRID_API_KEY = functions.config().sendgrid.key


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


exports.httpEmail = functions.https.onRequest((req, res) => {
  
  cors(req, res, () => {
    const toName  = req.body.toName;
    const toEmail = req.body.toEmail;
    const toFrom = req.body.toFrom;
    const toSubject = req.body.toSubject;
    const toBody = req.body.toBody;

    const msg = {
      to: toEmail,
      from: toFrom,
      templateId: 'd-059d59c6d467446cb8af4d4b2cccf4eb',
      dynamic_template_data: {
        subject:toSubject,
        name: toName,
        body: toBody
      },
    };

    return sgMail.send(msg)          
        .then(() => res.status(200).send({'message':'sent!'}))
        .catch(err => res.status(400).send(err) )      
  });
  
});
