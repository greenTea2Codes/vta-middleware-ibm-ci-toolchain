const { derive_reference_id } = require("../services/utilities");

const whitespaceRegex = /\s+/g;

exports.createSubtopicStructure = (subtopics, topic_welcome_node, questions) => {

    let subtopic_sibling;
    let subtopic_wNodes = [];
    let subtopic_structure = [];

    subtopics.forEach(subtopic => {
        console.log(`Creating subtopic: ${subtopic.title}`);

        // Create Subtopic Folder node
        const subtopic_folder = createSubtopicFolder(subtopic, topic_welcome_node);

        // Add previous_sibling if applicable
        if (subtopic_sibling) {
            subtopic_folder.previous_sibling = subtopic_sibling;
        }
        // Save node id for the next iteration
        subtopic_sibling = subtopic_folder.dialog_node;

        // Number of questions for this subtopic
        const subtopic_question_count = questions.filter(q => derive_reference_id(q.question_id) === subtopic.reference_id).length;

        // Create Subtopic Welcome node and add context variables
        const subtopic_welcome_node = createSubtopicWelcomeNode(subtopic, subtopic_folder, subtopic_question_count);
        subtopic_welcome_node.context = createContextVariables(subtopic_welcome_node, questions);

        // Add nodes
        subtopic_structure.push(subtopic_folder);
        subtopic_structure.push(subtopic_welcome_node);

        // Figure out why these are put here also
        subtopic_wNodes.push(subtopic_welcome_node);
    });

    return { subtopic_structure, subtopic_wNodes };
}

const createSubtopicFolder = (subtopic, topic_welcome_node) => {
    return {
        dialog_node: topic_welcome_node.dialog_node + '_subtopicFolder_' + subtopic.title.toLowerCase().replace(whitespaceRegex, '_'),
        conditions: `input.text.toLowerCase().contains(\'${subtopic.title.toLowerCase()}\')`,
        parent: topic_welcome_node.dialog_node,
        title: `Subtopic: ${subtopic.title}`,
        type: 'folder'
    };
};

const createSubtopicWelcomeNode = (subtopic, subtopic_folder, num_questions) => {
    return {
        dialog_node: subtopic_folder.dialog_node + '_welcomeNode',
        conditions: 'true',
        parent: subtopic_folder.dialog_node,
        title: `Welcome to ${subtopic.title}`,
        type: 'standard',
        output: {
            generic: [
                {
                    values: [
                        {
                            text: subtopic.subtopic_welcome_text
                        },
                        {
                            text: `Number of questions in this exercise: ${num_questions}`
                        },
                        {
                            text: "Are you ready to start exercise?"
                        }
                    ],
                    response_type: "text",
                    selection_policy: "multiline"
                }
            ]
        },
        reference_id: subtopic.reference_id
    }
};

const createContextVariables = (subtopic_welcome_node, questions) => {
    const subtopic_questions = questions.filter(q => derive_reference_id(q.question_id) === subtopic_welcome_node.reference_id);

    let context_variables = {
        progress: 0,
        total_questions: subtopic_questions.length
    };

    subtopic_questions.forEach((_, i) => {
        context_variables[`is_q_${i + 1}_answered_correctly`] = 0;
    })

    return context_variables;
};