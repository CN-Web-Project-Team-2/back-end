const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { testService, purchaseCodeService } = require('../services');
// const courseModel = require('../models/course.model');

const createTest = catchAsync(async (req, res) => {
  const test = await testService.createTest(req.body);
  res.status(httpStatus.CREATED).send(test);
});

const getTests = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'grade', 'tags']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (!req.user?.isStaff) filter.isPublic = true;
  const result = await testService.queryTests(filter, options);
  res.send(result);
});

const getTest = catchAsync(async (req, res) => {
  const options = pick(req.query, ['populate']);
  const test = await testService.getTestById(req.params.testId, options);
  if (!test) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found');
  }
  if (options?.populate?.includes("questions")) {
    test.questions = test.questions.map(q => {
      q.choices = q.choices.map(c => ({ ...c.toJSON(), isTrue: undefined }));
      return q;
    });
  }
  res.send(test);
});




module.exports = {
  createTest,
  getTests,
  getTest,
  
};
