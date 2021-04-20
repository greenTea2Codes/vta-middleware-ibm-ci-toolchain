const watsonAPI = require('../services/watsonAssistantV1');
const courseUtils = require('../watson/course');
const topicUtils = require('../watson/topic');
const exerciseUtils = require('../watson/exercise');

exports.createExercise = async (data) => {

    const configuration = data.configuration;
    const questions = data.questions;

    // Determine template type
    const template_type = configuration.template_type;

    // Create according to template
    if (template_type === 'single-choice-exercise') {
        // Create single choice exercise
        return createSingleChoiceExercise(configuration, questions);
    }

    throw "Template not recognized!";
};

const createSingleChoiceExercise = async (configuration, questions) => {
    // create course folder and check if it already exists
    const course_folder = courseUtils.createCourseFolder(configuration);
    const courseExists = await watsonAPI.doesNodeExist(course_folder.dialog_node);

    const course_content = createCourseContent(configuration, questions, course_folder);
    const dialog_nodes = [course_folder].concat(course_content);

    if (courseExists) {
        // Delete existing course node and children before continuing
        console.log('Course exists!');
        const deleted = await watsonAPI.deleteNode(course_folder.dialog_node);
        if (deleted) {
            console.log(`Course ${configuration.course_id} deleted successfully!`);
        } else {
            throw "Course exists and deleting was unsuccessful!";
        }
    } else {
        console.log(`Creating new course: ${configuration.course_id}`);
    }

    return watsonAPI.updateWorkspace(dialog_nodes, true);
}

const createCourseContent = (configuration, questions, course_folder) => {
    // create course welcome node
    const course_welcome_node = courseUtils.createCourseWelcomeNode(configuration, course_folder);

    // create topic structure
    // todo: find a better way to access the subtopic welcome nodes
    const topics = configuration.topics;
    const { topic_structure, subtopic_welcome_nodes } = topicUtils.createTopicStructure(topics, questions, course_folder, course_welcome_node);

    // create exercise structure
    const exercise_structure = exerciseUtils.createExerciseStructure(configuration, questions, subtopic_welcome_nodes, course_welcome_node);

    // Return all nodes in a single array
    return [course_welcome_node]
        .concat(topic_structure)
        .concat(exercise_structure)
}