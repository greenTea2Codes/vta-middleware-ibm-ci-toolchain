const Cloudant = require('@cloudant/cloudant');

const url = process.env.CLOUDANT_API_URL;
const cloudant = new Cloudant(url);

exports.addAnswerItem = (answerItem) => {
    return cloudant.use("answer_store").insert(answerItem);
}

exports.addAnswerItems = answerItems => {
    return cloudant.use("answer_store").bulk({ docs: answerItems });
}

exports.getRevisions = keys => {
    return cloudant.use("answer_store").fetch({ keys: keys });
}