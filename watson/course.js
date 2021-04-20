const whitespaceRegex = /\s+/g;

exports.createCourseFolder = configuration => {
    const course_id = configuration.course_id;
    const course_name = configuration.course_name;

    return {
        dialog_node: 'course_' + course_id.toLowerCase().replace(whitespaceRegex, '_'),
        conditions: `input.text.toLowerCase().contains(\"${course_name.toLowerCase()}\")`,
        digress_in: 'does_not_return',
        previous_sibling: 'Welcome',
        title: `${course_name} [${course_id}]`,
        type: 'folder'
    };
};

exports.createCourseWelcomeNode = (configuration, course_folder) => {

    const course_name = configuration.course_name;
    const course_id = configuration.course_id;

    const topicOptions = configuration.topics.map(topic => {
        return {
            label: topic.title,
            value: {
                input: {
                    text: topic.title
                }
            }
        };
    });

    return {
        dialog_node: course_folder.dialog_node + '_welcomeNode',
        conditions: 'true',
        parent: course_folder.dialog_node,
        title: 'Welcome to study ' + course_name,
        type: 'standard',
        context: { course_id: course_id },
        output: {
            generic: [
                {
                    values: [
                        {
                            text: `Welcome to study ${course_name}`
                        }
                    ],
                    response_type: 'text',
                },
                {
                    title: 'Please select one of the topics to start:',
                    options: topicOptions,
                    response_type: 'option'
                }
            ]
        }
    };
};