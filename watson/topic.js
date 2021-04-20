const subtopicUtils = require('./subtopic');

const whitespaceRegex = /\s+/g;

exports.createTopicStructure = (topics, questions, course_folder, course_welcome_node) => {

    let topic_sibling;
    let topic_structure = [];

    // Figure out another way to get these
    let subtopic_welcome_nodes = [];

    topics.forEach(topic => {
        console.log(`Creating topic: ${topic.title}`);

        // Create Topic Folder node
        const topic_folder = createTopicFolder(topic, course_folder, course_welcome_node);

        // Append previous sibling (previous topic) if applicable
        if (topic_sibling) {
            topic_folder.previous_sibling = topic_sibling;
        }
        // Save the node id for the next iteration
        topic_sibling = topic_folder.dialog_node;

        // Create Topic Welcome node
        const topic_welcome_node = createTopicWelcomeNode(topic, topic_folder);

        // Create Subtopic nodes
        // const subtopic_structure = dialogUtils.createSubtopicStructure(topic.subtopics, topic_welcome_node, questions);
        const { subtopic_structure, subtopic_wNodes } = subtopicUtils.createSubtopicStructure(topic.subtopics, topic_welcome_node, questions);

        // Add the nodes
        topic_structure.push(topic_folder);
        topic_structure.push(topic_welcome_node);
        topic_structure = topic_structure.concat(subtopic_structure);

        subtopic_welcome_nodes = subtopic_welcome_nodes.concat(subtopic_wNodes);
    });

    return { topic_structure, subtopic_welcome_nodes };
};

const createTopicFolder = (topic, course_folder, course_welcome_node) => {
    return {
        dialog_node: course_folder.dialog_node + '_topicFolder_' + topic.title.toLowerCase().replace(whitespaceRegex, '_'),
        conditions: `input.text.toLowerCase().contains(\'${topic.title.toLowerCase()}\')`,
        parent: course_welcome_node.dialog_node,
        title: 'Topic: ' + topic.title,
        type: 'folder'
    };
};

const createTopicWelcomeNode = (topic, topicFolder) => {

    const subtopicOptions = topic.subtopics.map(subtopic => {
        return {
            label: subtopic.title,
            value: {
                input: {
                    text: subtopic.title
                }
            }
        };
    });

    return {
        dialog_node: topicFolder.dialog_node + '_welcomeNode',
        conditions: 'true',
        parent: topicFolder.dialog_node,
        title: 'Welcome to ' + topic.title,
        type: 'standard',
        output: {
            generic: [
                {
                    values: [
                        {
                            text: topic.topic_welcome_text
                        }
                    ],
                    response_type: 'text'
                },
                {
                    title: 'Subtopics to choose from:',
                    options: subtopicOptions,
                    response_type: 'option'
                }
            ]
        }
    };
};