var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });

const sendEmail = (event, context, callback) => {
  var qStrings = JSON.parse(event.body);

  var eParams = {
    Destination: {
      ToAddresses: [qStrings.email]
      // BccAddresses: [<removed from forum post>]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: qStrings.htmlString || " ... no htmlString found in params"
        },
        Text: {
          Charset: "UTF-8",
          Data: "... not used"
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: qStrings.subject || "Default subject"
      }
    },
    Source: "notify@harbor.school",
    ReturnPath: "notify@harbor.school"
  };

  console.log("===SENDING EMAIL===");
  var email = ses.sendEmail(eParams, function(err, data) {
    if (err) console.log(err);
    else {
      console.log("===EMAIL SENT===");
      console.log(data);
      context.succeed(event);
    }
  });

  var responseBody = { message: "Successfully sent email" };

  var response = {
    statusCode: 200,
    headers: { my_header: "my_value" },
    body: JSON.stringify(responseBody),
    isBase64Encoded: false
  };
  callback(null, response);
};
export default sendEmail;
