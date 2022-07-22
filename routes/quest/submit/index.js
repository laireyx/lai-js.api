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

  fastify.post(
    "/:qid",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            code: { type: "string", maxLength: 16 * 1024 },
          },
        },
      },
    },
    async function (request, reply) {
      const quest = await collection.findOne({ no: request.qid });

      if (!quest) {
        reply.code(400);
      }

      const judgeResult = fastify.judge(request.body.code, quest.judge);

      return judgeResult;
    }
  );
};
