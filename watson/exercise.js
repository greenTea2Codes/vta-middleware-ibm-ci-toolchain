const { derive_reference_id } = require("../services/utilities");

exports.createExerciseStructure = (configuration, questions, subtopic_welcome_nodes, course_welcome_node) => {

    let sibling_node;
    let exercise_nodes = [];
    let question_nodes = [];
    let exercise_end_nodes = [];

    questions.forEach((question, index, array) => {
        const ref_id = derive_reference_id(question.question_id);
        if (!ref_id) {
            return; // Continue to next item
        }

        const parent_node = subtopic_welcome_nodes.find(n => n.reference_id === ref_id);
        if (!parent_node) {
            return; // Continue to next item
        }

        const question_node = createQuestion(question, parent_node, configuration.course_id);
        // todo: should check question type
        // internal properties for creating subsequent nodes
        question_node.reference_id = ref_id;
        question_node.question_id = question.question_id;

        if (sibling_node && sibling_node.parent === question_node.parent) {
            question_node.previous_sibling = sibling_node.dialog_node;
        }
        sibling_node = question_node;

        exercise_nodes.push(question_node);
        question_nodes.push(question_node);

        // create an end node for the questions of a sub topic
        if (index + 1 === array.length || ref_id !== derive_reference_id(array[index + 1].question_id)) {
            const exercise_end_node = createExerciseEndNode(sibling_node, parent_node);
            exercise_end_nodes.push(exercise_end_node);

            let context_vars = Object.keys(parent_node.context);
            let cond = '';
            for (let j = 0; j < context_vars.length; j++) {
                if (j === 0) {
                    cond = `$${context_vars[j]} == 0`;
                } else {
                    cond = cond + ` || $${context_vars[j]} == 0`;
                }
            }

            const return_to_first_question = createReturnToFirstQuestion(cond, exercise_end_node, ref_id, configuration.course_id);
            const return_to_course_welcome_node = createReturnToCourseWelcomeNode(exercise_end_node, return_to_first_question, course_welcome_node);

            exercise_nodes.push(exercise_end_node);
            exercise_nodes.push(return_to_first_question);
            exercise_nodes.push(return_to_course_welcome_node);
        }
    });

    // create response condition for each question dialog node
    const response_conditions = createResponseConditions(questions, question_nodes, exercise_end_nodes);
    exercise_nodes = exercise_nodes.concat(response_conditions);

    return exercise_nodes;
}

const createResponseConditions = (questions, question_nodes, exercise_end_nodes) => {

    let response_conditions = [];

    question_nodes.forEach((question_node, index, array) => {

        const question_data = questions.find(q => q.question_id === question_node.question_id);
        const exercise_end_node = exercise_end_nodes.find(n => n.parent === question_node.parent);
        const answer_eval_node = createAnswerEvaluationNode(question_node, exercise_end_node);

        if (index + 1 < question_nodes.length && question_node.reference_id === array[index + 1].reference_id) {
            answer_eval_node.next_step.dialog_node = array[index + 1].dialog_node;
        }

        const question_order = question_node.question_id.split('.');

        const correct_answer_node = createCorrectAnswerNode(question_data, answer_eval_node);
        correct_answer_node.context[`is_q_${question_order[question_order.length - 1]}_answered_correctly`] = 1;
        const incorrect_answer_node = createIncorrectAnswerNode(question_data, answer_eval_node, correct_answer_node);

        response_conditions.push(answer_eval_node);
        response_conditions.push(correct_answer_node);
        response_conditions.push(incorrect_answer_node);
    });

    return response_conditions;
}

const createQuestion = (question, parent_node, course_id) => {

    const digits = question.question_id.split('.');

    const options = question.hasOwnProperty('options')
        ? question.options.map(option => {
            return {
                label: option,
                value: {
                    input: {
                        text: option
                    }
                }
            };
        })
        : [];

    const output_array = [
        {
            values: [
                {
                    text: question.question_text
                }
            ],
            response_type: 'text'
        },
        {
            title: 'Please choose the correct answer:',
            options: options,
            response_type: 'option'
        }
    ];

    if (question.image_url) {
        output_array.unshift({
            source: question.image_url,
            response_type: 'image'
        });
    }

    const output = {
        generic: output_array
    };

    return {
        dialog_node: `${course_id}_q_node_${question.question_id}`,
        parent: parent_node.dialog_node,
        title: `Question ${question.question_id}`,
        type: 'standard',
        conditions: `$is_q_${digits[digits.length - 1]}_answered_correctly == 0`,
        output: output
    };
};

const createExerciseEndNode = (sibling_node, parent_node) => {
    return {
        dialog_node: parent_node.dialog_node + '_exercise_endnode',
        conditions: 'anything_else',
        parent: parent_node.dialog_node,
        title: 'Exercise End Node',
        type: 'standard',
        previous_sibling: sibling_node.dialog_node,
        metadata: {
            _customization: {
                mcr: true
            }
        }
    };
};

const createReturnToFirstQuestion = (cond, exercise_end_node, ref_id, course_id) => {
    return {
        type: "response_condition",
        parent: exercise_end_node.dialog_node,
        conditions: cond,
        dialog_node: exercise_end_node.dialog_node + '_go_to_q_1',
        next_step: {
            behavior: "jump_to",
            selector: "condition",
            dialog_node: `${course_id}_q_node_${ref_id}.1`
        }
    };
};

const createReturnToCourseWelcomeNode = (exercise_end_node, return_to_first_question, course_welcome_node) => {
    return {
        type: "response_condition",
        output: {
            generic: [
                {
                    values: [
                        {
                            text: "Yeah! You have completed the exercise now."
                        }
                    ],
                    response_type: "text",
                    selection_policy: "sequential"
                }
            ]
        },
        parent: exercise_end_node.dialog_node,
        previous_sibling: return_to_first_question.dialog_node,
        conditions: 'anything_else',
        dialog_node: exercise_end_node.dialog_node + '_go_to_course_welcome_node',
        next_step: {
            behavior: "jump_to",
            selector: "condition",
            dialog_node: course_welcome_node.dialog_node
        }
    };
};

const createAnswerEvaluationNode = (question_node, exercise_end_node) => {
    return {
        type: "standard",
        parent: question_node.dialog_node,
        metadata: {
            _customization: {
                mcr: true
            }
        },
        next_step: {
            behavior: "jump_to",
            selector: "condition",
            dialog_node: exercise_end_node.dialog_node
        },
        conditions: "true",
        dialog_node: question_node.dialog_node + '_answer_eval_node'
    };
};

const createCorrectAnswerNode = (question_data, answer_evaluation_node) => {
    return {
        type: "response_condition",
        output: {
            generic: [
                {
                    values: [
                        {
                            text: question_data.response_to_correct_answer
                        },
                        {
                            text: `You have completed $progress / $total_questions questions.`
                        }
                    ],
                    response_type: "text",
                    selection_policy: "multiline"
                }
            ]
        },
        parent: answer_evaluation_node.dialog_node,
        context: {
            progress: `<? $progress + 1 ?>`
        },
        conditions: `input.text == "${question_data.answer_items[0].value}"`,
        dialog_node: answer_evaluation_node.dialog_node + '_correct_answer'
    };
};

const createIncorrectAnswerNode = (question_data, answer_evaluation_node, correct_answer_node) => {
    return {
        type: "response_condition",
        output: {
            generic: [
                {
                    values: [
                        {
                            text: question_data.response_to_incorrect_answer
                        },
                        {
                            text: `You have completed $progress / $total_questions questions.`
                        }
                    ],
                    response_type: "text",
                    selection_policy: "multiline"
                }
            ]
        },
        parent: answer_evaluation_node.dialog_node,
        conditions: `anything_else`,
        dialog_node: answer_evaluation_node.dialog_node + '_incorrect_answer',
        previous_sibling: correct_answer_node.dialog_node
    }
}