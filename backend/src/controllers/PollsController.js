/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
const models = require("../models");

class PollsController {
  static findAll = async (req, res) => {
    try {
      const [polls] = await models.polls.browseAll();

      const results = [];

      polls.forEach((poll) => {
        if (
          results.length === 0 ||
          results[results.length - 1].id !== poll.id
        ) {
          const pollData = {
            id: poll.id,
            text: poll.text,
            date: poll.date,
            author: poll.author,
            category_id: poll.category_id,
            category_name: poll.category_name,
            author_imgLink: poll.author_imgLink,
            usersAgree: [],
            usersDisagree: [],
          };

          if (poll.userAgree) {
            pollData.usersAgree.push(poll.userAgree);
          }

          if (poll.userDisagree) {
            pollData.usersDisagree.push(poll.userDisagree);
          }

          results.push(pollData);
        } else if (results[results.length - 1].id === poll.id) {
          if (poll.userAgree) {
            results[results.length - 1].usersAgree.push(poll.userAgree);
          }

          if (poll.userDisagree) {
            results[results.length - 1].usersDisagree.push(poll.userDisagree);
          }
        }
      });

      return res.status(200).send(results);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  // static findByCategories = async (req, res) => {
  //   const categoryId = parseInt(req.params.categoryId, 10);
  //   try {
  //     const [polls] = await models.polls.browseByCategories(categoryId);

  //     const results = [];

  //     polls.forEach((poll) => {
  //       if (
  //         results.length === 0 ||
  //         results[results.length - 1].id !== poll.id
  //       ) {
  //         const pollData = {
  //           id: poll.id,
  //           text: poll.text,
  //           date: poll.date,
  //           author: poll.author,
  //           category_id: poll.category_id,
  //           category_name: poll.category_name,
  //           author_imgLink: poll.author_imgLink,
  //           usersAgree: [],
  //           usersDisagree: [],
  //         };

  //         if (poll.userAgree) {
  //           pollData.usersAgree.push(poll.userAgree);
  //         }

  //         if (poll.userDisagree) {
  //           pollData.usersDisagree.push(poll.userDisagree);
  //         }

  //         results.push(pollData);
  //       } else if (results[results.length - 1].id === poll.id) {
  //         if (poll.userAgree) {
  //           results[results.length - 1].usersAgree.push(poll.userAgree);
  //         }

  //         if (poll.userDisagree) {
  //           results[results.length - 1].usersDisagree.push(poll.userDisagree);
  //         }
  //       }
  //     });

  //     return res.status(200).send(results);
  //   } catch (err) {
  //     return res.status(500).send(err.message);
  //   }
  // };

  static readById = async (req, res) => {
    const pollsId = parseInt(req.params.id, 10);
    try {
      const [[polls]] = await models.polls.browseById(pollsId);
      if (!polls) {
        res.status(404).send("polls not found");
      }
      polls.agree = await models.polls.browseUsersAgreeId(pollsId);
      polls.disagree = await models.polls.browseUsersDisagreeId(pollsId);
      polls.comments = await models.comments.findAllByPolls(pollsId);
      return res.status(200).send(polls);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  static add = async (req, res) => {
    const polls = req.body;
    try {
      await models.polls.create({ ...polls, user_id: req.userId });
      return res.sendStatus(201);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };
}

module.exports = PollsController;