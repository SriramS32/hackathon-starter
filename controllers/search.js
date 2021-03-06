const Schema = require('../models/Schema');
const Entity = Schema.Entity;
const Rating = Schema.Rating;
const Poll = Schema.Poll;
const Comment = Schema.Comment;
const PollVote = Schema.PollVote;

/**
 * Selects tag search or free text based on checkbox
 * Unchecked - free text search, Checked - tag search
 * Tags should be separated by commas ", "
 */
/* istanbul ignore next */
exports.search = function(req, res){
    let opt = req.body.agreement;
    if (typeof opt !== 'undefined' && opt) {
        let query = req.body.query.split(', '); // query is an array of tags
        let pollPromise = Poll.find( { hidden: false, tags: { $in: query }} ).sort({likeWeight: -1}).limit(3).exec();
        let entityPromise = Entity.find( { hidden: false, tags: { $in: query }} ).sort({ratingAverage: -1}).limit(6).exec();
        Promise.all([pollPromise, entityPromise]).then((results) => {
            let [polls, entities] = results;
            res.render('results-page', {
                polls: polls,
                entities: entities
            });
        });
    }
    else {
        let query = req.body.query;
        let pollPromise = Poll.find( { hidden: false, question: { $regex: query, $options: 'i' }} ).sort({likeWeight: -1}).limit(3).exec();
        let entityPromise = Entity.find( { hidden: false, name: { $regex: query, $options: 'i' }} ).sort({ratingAverage: -1}).limit(6).exec();
        Promise.all([pollPromise, entityPromise]).then((results) => {
            let [polls, entities] = results;
            console.log(results);
            res.render('results-page', {
                polls: polls,
                entities: entities
            });
        });
    }
}

/* istanbul ignore next */
exports.freeTextSearch = function(req, res) {
    let query = req.body.query;
    let pollPromise = Poll.find( { hidden: false, question: { $regex: query, $options: 'i' }} ).limit(3).exec();
    let entityPromise = Entity.find( { hidden: false, name: { $regex: query, $options: 'i' }} ).sort({ratingAverage: -1}).limit(6).exec();
    Promise.all([pollPromise, entityPromise]).then((results) => {
        let [polls, entities] = results;
        console.log(results);
        res.render('results-page', {
            polls: polls,
            entities: entities
        });
    });
};

/* istanbul ignore next */
exports.keywordSearch = function(req, res) {
    let query = [req.body.category.split(", ")]; // query is an array of tags
    let pollPromise = Poll.find( { hidden: false, tags: { $in: query }} ).limit(3).exec();
    let entityPromise = Entity.find( { hidden: false, tags: { $in: query }} ).sort({ratingAverage: -1}).limit(6).exec();
    Promise.all([pollPromise, entityPromise]).then((results) => {
        let [polls, entities] = results;
        res.render('results-page', {
            polls: polls,
            entities: entities
        });
    });
};

exports.fetchTrendingPolls = function(limit) {
    return Poll.find({ hidden: false, closedAfter: {$gt: new Date()}}).sort({createdOn: -1}).limit(limit).exec();
};

exports.fetchTrendingEntities = function(limit) {
    return Entity.find( { hidden: false } ).sort({ratingAverage: -1}).limit(limit).exec();    
}

exports.fetchEntity = function(entity) {
    return Entity.findOne({_id: entity}).exec();
}

exports.getRecentActivity = function(user) {
    let ratingPromise = Rating.find( {user: user} ).exec();
    let commentPromise = Comment.find( {ownerId: user} ).exec();
    let pollVotePromise = PollVote.find( {user: user} ).exec();
    let pollPromise = Poll.find( {owner: user} ).exec();
    return {
        rating: ratingPromise,
        comment: commentPromise,
        pollVote: pollVotePromise,
        poll: pollPromise
    };
};

exports.filterTags = function (results, tags) {
    return results.filter((entry, index, res) => {
        return entry.tags.filter((e, i, a) => {
            return tags.includes(e);
        }).length > 0;
    });
}