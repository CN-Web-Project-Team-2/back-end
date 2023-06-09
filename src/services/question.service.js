const httpStatus = require("http-status");
const { Question } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a question
 * @param {Object} questionBody
 * @returns {Promise<Question>}
 */
const createQuestion = async (questionBody) => {
  console.log("qt",questionBody);
  return Question.create(questionBody);
};

const createQuestions = async (body) => {
  return Question.insertMany(body)
}

/**
 * Query for questions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryQuestions = async (filter, options) => {
  if (filter.query) {
    filter.question = { $regex: filter.query, $options: "i" };
    // const regex = new RegExp(`${filter.query}`)
  }
  delete filter.query;
  delete filter.isSolved;
  if (filter.tags) filter.tags = { $all: filter.tags.split(",") };
  // if (filter.isSolved)
  //   filter["$expr"] = { $gt: [{ $strLenCP: "$answer" }, 10] };
  console.log(filter);
  const questions = await Question.paginate(filter, options);
  return questions;
};

/**
 * Get question by id
 * @param {ObjectId} id
 * @returns {Promise<Question>}
 */
const getQuestionById = async (id) => {
  return Question.findById(id);
};

/**
 * Get question by email
 * @param {string} email
 * @returns {Promise<Question>}
 */
const getQuestionByEmail = async (email) => {
  return Question.findOne({ email });
};

/**
 * Update question by id
 * @param {ObjectId} questionId
 * @param {Object} updateBody
 * @returns {Promise<Question>}
 */
const updateQuestionById = async (questionId, updateBody) => {
  const question = await getQuestionById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
  }
  //   if (updateBody.email && (await Question.isEmailTaken(updateBody.email, questionId))) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  //   }
  Object.assign(question, updateBody);
  await question.save();
  return question;
};

/**
 * Delete question by id
 * @param {ObjectId} questionId
 * @returns {Promise<Question>}
 */
const deleteQuestionById = async (questionId) => {
  const question = await getQuestionById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
  }
  await question.remove();
  return question;
};

module.exports = {
  createQuestion,
  createQuestions,
  queryQuestions,
  getQuestionById,
  getQuestionByEmail,
  updateQuestionById,
  deleteQuestionById,
  
};
