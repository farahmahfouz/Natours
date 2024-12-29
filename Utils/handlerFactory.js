const APIFeatures = require('./api-features');
const AppError = require('./app.error');
const catchAsync = require('./catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;
    const doc = await Model.findByIdAndDelete(docId);
    if (!doc) next(new AppError(`No doc found with this ID`, 404));
    res.status(200).send({
      status: 'success',
      message: `deleted successfully`,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const modelId = req.params.id;
    const updateModel = req.body;
    const doc = await Model.findByIdAndUpdate(modelId, updateModel, {
      new: true,
      runValidators: true,
    });
    if (!doc) next(new AppError(`No document found with this ID`, 404));
    res.status(200).send({
      status: 'success',
      message: 'updateded successfully',
      data: { doc },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).send({
      status: 'success',
      message: 'Document added successfully',
      data: doc,
    });
  });

exports.getOne = (Model, populateOpt) =>
  catchAsync(async (req, res, next) => {
    const modelId = req.params.id;
    let query = Model.findById(modelId);
    if (populateOpt) query = query.populate(populateOpt);
    const doc = await query;
    if (!doc) {
      return next(new AppError(`No Document found with this ID`, 404));
    }
    res.status(200).send({
      status: 'success',
      message: 'Document retrieved successfully',
      data: { doc },
    });
  });

exports.getAll = (Model, populateOpt) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // const tour = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .pagination();

    const docs = await features.query;
    // const docs = await features.query.explain();
    res.status(200).send({
      status: 'success',
      message: 'Documents retrieved successfully',
      results: docs.length,
      data: { docs },
    });
  });
