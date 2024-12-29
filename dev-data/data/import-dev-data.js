const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../Models/tourModel');
const Review = require('../../Models/reviewModel.js');
const User = require('../../Models/userModel.js');
require('dotenv').config();

mongoose
  .connect(process.env.DATA_BASE)
  .then(() => console.log('DB connected successfully'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log(`Data retrieved successfully`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  await Tour.deleteMany();
  await User.deleteMany();
  await Review.deleteMany();
  console.log(`Data successfully deleted`);

  try {
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
