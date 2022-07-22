"use strict";

/**
 *
 * @param {import('fastify').FastifyInstance} fastify
 * @param {import('@fastify/mongodb').FastifyMongoObject} fastify.mongo
 * @param {*} opts
 */
module.exports = async function (fastify, opts) {
  const collection = fastify.mongo.db.collection("quest");

  fastify.get("/", async function (request, reply) {
    return "Give me a quest.";
  });

  fastify.get("/:qid", async function (request, reply) {
    const quest = await collection.findOne({ no: request.qid });

    if (!quest) {
      reply.code(404);
    }

    return {
      qid: quest.qid,
      title: quest.title,
      content: quest.content,
      sample: quest.sample,
    };
  });
};
