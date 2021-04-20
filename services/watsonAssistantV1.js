const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config({path: './config/.env'});

const assistant = new AssistantV1({
    version: process.env.ASSISTANT_API_V1_VERSION,
    authenticator: new IamAuthenticator({
        apikey: process.env.ASSISTANT_IAM_APIKEY
    }),
    serviceUrl: process.env.ASSISTANT_URL
});

const defParams = {
    workspaceId: process.env.WORKSPACE_ID,
}

exports.updateWorkspace = (dialogNodes, append = true) => {
    const params = {
        ...defParams,
        dialogNodes,
        append: append
    }

    // console.log('Sending update workspace request with data:\n', params);
    return assistant.updateWorkspace(params);

}

exports.getNodes = () => {
    const params = {
        ...defParams
    }

    return assistant.listDialogNodes(params);
}

exports.getNode = dialog_node => {
    const params = {
        ...defParams,
        dialogNode: dialog_node
    };

    return assistant.getDialogNode(params);
}

exports.getNodeAsync = async dialog_node => {
    const params = {
        ...defParams,
        dialogNode: dialog_node
    };

    try {
        const result = await assistant.getDialogNode(params);
        // console.log(`Result of getDialogNode(${dialog_node}):`);
        // console.log(result.result);
        return result.result;
    } catch (err) {
        // console.log(`Error occurred in getDialogNode(${dialog_node})`);
        return null;
    }
}

exports.doesNodeExist = async dialog_node => {
    const params = {
        ...defParams,
        dialogNode: dialog_node
    };

    try {
        const result = await assistant.getDialogNode(params);
        // console.log(`Result of getDialogNode(${dialog_node}):`);
        // console.log(result.result);
        return true;
    } catch (err) {
        // console.log(`Error occurred in getDialogNode(${dialog_node})`);
        return false;
    }
}

exports.deleteNode = async (dialog_node) => {
    const params = {
        ...defParams,
        dialogNode: dialog_node
    }

    try {
        const result = await assistant.deleteDialogNode(params);
        console.log(`Result of deleteDialogNode(${dialog_node}):`);
        console.log(result.result);
        return true;
    } catch (err) {
        console.log(`Error occurred in getDialogNode(${dialog_node})`);
        return false;
    }
}