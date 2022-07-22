"use strict";

const fp = require("fastify-plugin");
const ivm = require("isolated-vm");

/**
 * @typedef {object} JudgeResult
 * @param {boolean} result
 * @param {Error} [error]
 */

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {
  fastify.decorate(
    "judge",
    /**
     *
     * @param {string} code
     * @param {string} judgeCode
     * @return {JudgeResult}
     */
    async function (code, judgeCode) {
      const isolate = new ivm.Isolate({ memoryLimit: 8 });

      try {
        const context = await isolate.createContext();
        const jail = context.global;

        await jail.set("global", jail.derefInto());

        await isolate
          .compileScript(code)
          .then((compiledCode) => compiledCode.run(context, { timeout: 1000 }));

        const result = await isolate
          .compileScript(judgeCode)
          .then((compiledCode) => compiledCode.run(context, { timeout: 1000 }));

        return {
          result,
          error: null,
        };
      } catch (error) {
        return {
          result: false,
          error: error.message,
        };
      } finally {
        isolate.dispose();
      }
    }
  );
});
