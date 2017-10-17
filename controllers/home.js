const Schema = require('../models/Schema');
const Entity = Schema.Entity;
const Rating = Schema.Rating;
const Comment = Schema.Comment;
/**
 * GET /
 * Home page.
 */
const searchController = require('./search');
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

exports.landing = (req, res) => {
  res.render('layout', {
     title: 'Landing Page'
   });
};

exports.escapeVelocity = (req, res) => {
  Promise.all([searchController.fetchTrendingPolls(2), searchController.fetchTrendingEntities(1)])
    .then((results) => {
      let [polls, entities] = results;
      res.render('escape-velocity', {
        polls: polls,
        entities: entities
      });
    });
};

exports.resultsPage = (req, res) => {
  // Promise.all([searchController.freeTextSearch(req.params.query)])

  res.render('results-page', {
     title: 'Results Page'
   });
};

exports.newEntryPage = (req, res) => {
  res.render('new-entry', {
     title: 'New Entry Page'
   });
};

exports.profilePage = (req, res) => {
  res.render('profile-page', {
    title: 'Profile Page'
  });
};

exports.error = (req, res) => {
  res.render('error', {
    title: 'Error'
  });
};