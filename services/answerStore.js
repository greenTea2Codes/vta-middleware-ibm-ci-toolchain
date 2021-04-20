const cloudantAPI = require('../services/cloudant');

exports.uploadAnswerStoreItems = async data => {

    const answerItems = createAnswerItems(data)
    const result = await cloudantAPI.addAnswerItems(answerItems);

    const addDocs = result.filter(doc => doc.ok);
    const errDocs = result.filter(doc => doc.hasOwnProperty('error'));

    const returnArray = addDocs.map(doc => {
        return `added item - id: ${doc.id}`;
    });

    if (errDocs.length === 0) {
        return returnArray; // All docs added successfully
    }

    // Some items already existed -> replace the existing items
    const keys = errDocs.map(doc => doc.id);
    const existingItems = await cloudantAPI.getRevisions(keys);
    existingItems.rows.forEach(item => returnArray.push(`item exists - id: ${item.id}, rev: ${item.value.rev}`));

    const modifiedItems = answerItems
        .filter(item => keys.includes(item._id))  // Items that had conflicts
        .map(item => {
            const existingItem = existingItems.rows.find(row => row.id === item._id);
            if (existingItem.doc.answerOptions[0].answerText !== item.answerOptions[0].answerText) {
                // Answer text is modified
                return {
                    ...item,
                    _rev: existingItem.value.rev
                }
            }
            returnArray.push(`Skipping unmodified item: ${item._id}`);
        }).filter(item => item); // Remove null


    if (!modifiedItems || modifiedItems.length === 0) {
        return returnArray; // No need to replace unmodified items
    }

    const replaceResult = await cloudantAPI.addAnswerItems(modifiedItems);

    replaceResult.forEach(doc => {
        if (doc.ok) {
            returnArray.push(`replaced item - ${doc.id}`);
        } else {
            returnArray.push(`could not replace item - ${doc.id}`);
        }
    })

    return returnArray;
}

const createAnswerItems = data => {

    const course_id = data.course_id;
    const tag = data.tag;
    const answer_store_items = data.answer_store_items;

    return answer_store_items.map(item => {
        return {
            _id: `${item.answer_store_id}:${course_id}:${item.language}`,
            answerId: item.answer_store_id,
            answerOptions: [
                {
                    additionalAnswerProposals: [],
                    answerText: item.answer,
                    language: item.language,
                }
            ],
            channel: course_id,
            tags: tag
        }
    });
}