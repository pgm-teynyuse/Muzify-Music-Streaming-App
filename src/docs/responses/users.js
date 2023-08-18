/* eslint-disable prettier/prettier */
export default {
  200: {
    description: "Successful response",
    content: {
      "application/json": {
        scheme: {
          $ref: "#/components/schemes/User",
        },
      },
    },
  },
};