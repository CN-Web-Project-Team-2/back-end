const httpStatus = require('http-status');
const { Test, AnswerSheet } = require('../models');
const answerSheetService = require('./answerSheet.service');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

/**
 * Create a test
 * @param {Object} testBody
 * @returns {Promise<Test>}
 */
const createTest = async (testBody) => {
  //   if (await Test.isEmailTaken(testBody.email)) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  //   }
  return Test.create(testBody);
};

/**
 * Query for tests
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTests = async (filter, options) => {
  if (filter.name) filter.name = { $regex: filter.name, "$options": "i" };
  if (filter.tags) tags = { $all: filter.tags.split(",") };
  console.log(filter);
  const tests = await Test.paginate(filter, options);
  return tests;
};


/**
 * Get test by id
 * @param {ObjectId} id
 * @returns {Promise<Test>}
 */
const getTestById = async (id, options) => {
  let testPromise = Test.findById(id);
  if (options?.populate) {
    options.populate.split(',').forEach((populateOption) => {
      testPromise = testPromise.populate(
        populateOption
          .split('.')
          .reverse()
          .reduce((a, b) => ({ path: b, populate: a }))
      );
    });
  }

  testPromise = testPromise.exec();

  return testPromise;
};

/**
 * Get test by email
 * @param {string} email
 * @returns {Promise<Test>}
 */



/**
 * Update test by id
 * @param {ObjectId} testId
 * @param {Object} updateBody
 * @returns {Promise<Test>}
 */

/**
 * Delete test by id
 * @param {ObjectId} testId
 * @returns {Promise<Test>}
 */



module.exports = {
  createTest,
  queryTests,
  getTestById,
  
};