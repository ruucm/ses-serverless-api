var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });
import { emailFrom } from "../../shared/consts";

const handler = async (event, context, callback) => {
  const result = await sendEmail({
    eventData: JSON.parse(event.body)
  });
  const response = {
    statusCode: result.statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(result)
  };

  callback(null, response);
};

const sendEmail = ({ eventData, ...rest }) =>
  new Promise((resolve, reject) => {
    var eParams = {
      Destination: {
        ToAddresses: eventData.emails
        // BccAddresses: [<removed from forum post>]
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: eventData.htmlString || " ... no htmlString found in params"
          },
          Text: {
            Charset: "UTF-8",
            Data: "... not used"
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: eventData.subject || "Default subject"
        }
      },
      Source: emailFrom,
      ReturnPath: emailFrom
    };

    console.log("===SENDING EMAIL===");
    var email = ses.sendEmail(eParams, (err, data) => {
      if (err) {
        console.log("err", err);
        resolve({ statusCode: 500, ...err });
      } else {
        console.log("===EMAIL SENT===");
        console.log(data);
        resolve({
          statusCode: 200,
          message: "Successfully sent email",
          ...data
        });
      }
    });
  });

export default handler;
