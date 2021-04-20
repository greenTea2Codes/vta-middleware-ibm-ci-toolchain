const { body } = require('express-validator');
exports.validate_single_choice_exercise_template = () => {
    return [
        body('configuration', 'configuration object is missing').exists(),
        body('configuration', 'configuration should be an object').isObject(),

        body('configuration.course_id', 'configuration.course_id is missing').exists(),
        body('configuration.course_id', 'configuration.course_id should not be empty').not().isEmpty(),
        body('configuration.course_id', 'configuration.course_id should be a string').isString(),

        body('configuration.course_name', 'configuration.course_name is missing').exists(),
        body('configuration.course_name', 'configuration.course_name should not be empty').not().isEmpty(),
        body('configuration.course_name', 'configuration.course_name should be a string').isString(),

        body('configuration.topics', 'configuration.topics is missing').exists(),
        body('configuration.topics', 'configuration.topics should be an array and contain at least one topic object').isArray({min: 1}),

        body('configuration.topics.*.title', 'title is missing').exists(),
        body('configuration.topics.*.title', 'title should not be empty').not().isEmpty(),
        body('configuration.topics.*.title', 'title should be a string').isString(),

        body('configuration.topics.*.topic_welcome_text', 'topic_welcome_text is missing').exists(),
        body('configuration.topics.*.topic_welcome_text', 'topic_welcome_text should be a string').isString(),

        body('configuration.topics.*.subtopics', 'subtopics is missing').exists(),
        body('configuration.topics.*.subtopics', 'subtopics should be an array and contain at least one subtopic object').isArray({min: 1}),

        body('configuration.topics.*.subtopics.*.title', 'title is missing').exists(),
        body('configuration.topics.*.subtopics.*.title', 'title should not be empty').not().isEmpty(),
        body('configuration.topics.*.subtopics.*.title', 'title should be a string').isString(),

        body('configuration.topics.*.subtopics.*.subtopic_welcome_text', 'subtopic_welcome_text is missing').exists(),
        body('configuration.topics.*.subtopics.*.subtopic_welcome_text', 'subtopic_welcome_text should be a string').isString(),

        body('configuration.topics.*.subtopics.*.reference_id', 'reference_id is missing').exists(),
        body('configuration.topics.*.subtopics.*.reference_id', 'reference_id should not be empty').not().isEmpty(),
        body('configuration.topics.*.subtopics.*.reference_id', 'reference_id should be a string').isString(),

        body('configuration.template_type', 'configuration.template_type is missing').exists(),
        body('configuration.template_type', 'configuration.template_type should not be empty').not().isEmpty(),
        body('configuration.template_type', 'configuration.template_type should be a string').isString(),

        body('questions', 'questions are missing').exists(),
        body('questions', 'questions should be an array and contain at least one question object').isArray({min: 1}),

        body('questions.*.question_id', 'question_id is missing').exists(),
        body('questions.*.question_id', 'question_id should not be empty').not().isEmpty(),
        body('questions.*.question_id', 'question_id should be a string').isString(),

        body('questions.*.question_text', 'question_text is missing').exists(),
        body('questions.*.question_text', 'question_text should not be empty').not().isEmpty(),
        body('questions.*.question_text', 'question_text should be a string').isString(),

        body('questions.*.question_type', 'question_type is missing').exists(),
        body('questions.*.question_type', 'question_type should not be empty').not().isEmpty(),
        body('questions.*.question_type', 'question_type should be a string').isString(),

        body('questions.*.image_url', 'image_url should be a valid url format').optional({nullable: true, checkFalsy: true}).isURL(),

        body('questions.*.points', 'points should be an integer').optional({nullable: true, checkFalsy: true}).isInt(),

        body('questions.*.fallback', 'fallback should be a boolean').optional().isBoolean(),

        body('questions.*.options', 'options should be an array').optional().isArray(),

        body('questions.*.options.*', 'option should be a string').optional().isString(),

        // body('questions.*.question_type', 'question_type should be either open or singleChoice').isIn(['open','singleChoice']),

        body('questions.*.answer_items', 'answer_items is missing').exists(),
        body('questions.*.answer_items', 'answer_items should be an array and contain at least one answer item').isArray({min: 1}),

        body('questions.*.answer_items.*.value', 'value is missing').exists(),
        body('questions.*.answer_items.*.value', 'value should not be empty').not().isEmpty(),
        body('questions.*.answer_items.*.value', 'value should be a string').isString(),

        body('questions.*.answer_items.*.synonyms', 'synonyms is missing').exists(),
        body('questions.*.answer_items.*.synonyms', 'synonyms should be array').isArray(),

        body('questions.*.answer_items.*.synonyms.*', 'synonym should be string').optional().isString(),

        body('questions.*.response_to_correct_answer', 'response_to_correct_answer is missing').exists(),
        body('questions.*.response_to_correct_answer', 'response_to_correct_answer should not be empty').not().isEmpty(),
        body('questions.*.response_to_correct_answer', 'response_to_correct_answer should be a string').isString(),

        body('questions.*.response_to_incorrect_answer', 'response_to_incorrect_answer is missing').exists(),
        body('questions.*.response_to_incorrect_answer', 'response_to_incorrect_answer should not be empty').not().isEmpty(),
        body('questions.*.response_to_incorrect_answer', 'response_to_incorrect_answer should be a string').isString()
    ]
};

exports.validate_answer_store_items = () => {
    return [
        body('course_id', 'Course ID is missing!').exists(),
        body('course_id', 'Course ID should not be empty!').not().isEmpty(),
        body('course_id', 'Course ID should be a string').isString(),

        body('tag', 'Tag is missing!').exists(),
        body('tag', 'Tag should not be empty!').not().isEmpty(),
        body('tag', 'Tag should be a string').isString(),

        body('answer_store_items', 'Answer Store Items array is missing!').exists(),
        body('answer_store_items', 'Answer Store Items should be an array').isArray({min: 1}),
        
        body('answer_store_items.*.answer_store_id', 'answer store id is missing!').exists(),
        body('answer_store_items.*.answer_store_id', 'answer store id should not be empty!').not().isEmpty(),
        body('answer_store_items.*.answer_store_id', 'answer store id should be a string!').isString(),

        body('answer_store_items.*.language', 'language is missing!').exists(),
        body('answer_store_items.*.language', 'language should not be empty!').not().isEmpty(),
        body('answer_store_items.*.language', 'language should be a string!').isString(),

        body('answer_store_items.*.answer', 'answer is missing!').exists(),
        body('answer_store_items.*.answer', 'answer should not be empty!').not().isEmpty(),
        body('answer_store_items.*.answer', 'answer should be a string!').isString(),
    ];
};