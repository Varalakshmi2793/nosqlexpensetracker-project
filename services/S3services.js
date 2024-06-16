
const AWS = require('aws-sdk');

exports.uploadtoS3 = async (data, filename) => {
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
    });

    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
            Body: data
        };

        s3bucket.upload(params, (err, response) => {
            if (err) {
                console.log("Something went wrong:", err);
                reject(err);
            } else {
                console.log('File uploaded successfully:', response.Location);
                resolve(response.Location);
            }
        });
    });
};




