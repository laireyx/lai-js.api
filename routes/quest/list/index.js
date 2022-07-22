"use strict";

const QUEST_PER_PAGE = 20;

/**
 *
 * @param {import('fastify').FastifyInstance} fastify
 * @param {import('@fastify/mongodb').FastifyMongoObject} fastify.mongo
 * @param {*} opts
 */
module.exports = async function (fastify, opts) {
  const collection = fastify.mongo.db.collection("quest");

  fastify.get("/", async function (request, reply) {
    return reply.redirect("/quest/list/1");
  });

  fastify.get(
    "/:p",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            p: { type: "number", default: 0, minimum: 0 },
          },
        },
      },
    },
    async function (request, reply) {
      const page = request.query.p;

      const quests = await collection
        .find()
        .sort({ qid: 1 })
        .skip(page * QUEST_PER_PAGE)
        .limit(QUEST_PER_PAGE)
        .toArray();

      return quests;
    }
  );
};
