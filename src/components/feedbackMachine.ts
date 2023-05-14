import { assign, createMachine } from "xstate";

export const feedbackMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDMyQEYEMDGBrAxAMIAyA8gMoCiA2gAwC6ioADgPawCWALh6wHZMQAD0QAWAEwAaEAE9EARloBWAHRLaGjQDYd8gOw69AXyPTUGHLhXMATqwC2zLvgBCAQQAidRkhBtOPPyCIgjyAJzyKpq0iqIAzAmiGqLScgjqeip66jFacUryhWFaJmZoEFh41naOzgDipKReDIL+3LwCviH6YVFxYbQAHEMFYUpagymyiAPiKqJ5g6Py4voLpSDmFZYqyKw29q5uhADS3q3s7UFdCoOR0bEJcUm0U2lxg5lh3z-icXpDPIbLaVKx7A4qSDtPhQfDkACqLgAsgBJAAq518bUCnVAIVEnxUAy04iUwwiAz0elSiAmgzUcS0Ehi8XU32B5VBu329khEGhsPhAAUPG40TQWljLjjgog4vJVEowv8lPl+hJBnEaelBvShglxGFJmFxKIzRyLFVwbzYABXdD2bg8GH4CD8MAqDh8ABurFwHpBO2tKjtDqdXqgCC9vuwmBx3kxLGlHVlCD0HxU-QBSnT4kGWmJ2tzaiWcXEMXl4iZogt2ytPJD9sdXGdsLANjsNmsABs48HA-WIaHm62oz7WLH4wxE35k9c8YglAUVFXxqbBqT5FpaFrpulSVFoqJFN9wkpa1zg+3O3DEaiMZKkwEUzcEASvrQSWTaBTaFTtTmcw5LQqzjAUIE1qYmycjs2DduwkD4AASpQ5Bom4SEPj4T5XLiwhygCWTPB8Wh6PIBIrIM2qxPMPw-KR2RmnEF5BjyrruiGXBxgGMGDvYM7Yi+C7pGa8ybgqxT5CsWjasUogqPmeiiEqW4fMq54bHwrAQHAggDrgFzPvO+EIAAtDJe6maodFhPEzwLOMYQsVUtgOE4hm4amObahu9IRORejiOmCQGMxUH6dyBweTKr5VpkSoqmqtl5ruaTxJkoh0RoQU5gSzlgg2UKttFQkmc8cykpoejKnowx5NqEy9DuTLluR+Q-k54W8QVQ5NuGMIlcZITZlkdybkoeavDoAHLjZtXyCFrz5ZFvLXvsg14SE5Urpl3xltu8iDGE1J7hNvRkgkSh2VuZqQWUlo9TafUtpAG2pmR9K6t8E0LQt6hKD5y6KceWhLqa8ryMtXAABaYHwuDwFKRmbYuJ1pIUhSjdWqxxDuBiQ11D0qHBCEQG9r4KnMALyvKnzfTEVF7ncajREuZGkkukEmEAA */
    schema: {
      events: {} as
        | { type: "UPDATE"; value: string }
        | {
            type: "GOOD";
          }
        | { type: "BAD" }
        | { type: "SUBMIT" }
        | { type: "BACK" }
        | { type: "CLOSE" }
        | {
            type: "RESTART";
          },
    },

    context: {
      feedback: "haha",
    },

    id: "feedback",

    states: {
      prompt: {
        on: {
          BAD: "form",
          GOOD: "thanks",
        },
      },

      form: {
        on: {
          BACK: "prompt",
        },

        initial: "editing",

        states: {
          editing: {
            on: {
              SUBMIT: {
                cond: "canSubmit",
                target: "submitting",
              },
              UPDATE: {
                actions: "updateFeedback",
              },
            },
          },

          submitting: {
            invoke: {
              src: (context, event) =>
                new Promise((res, rej) => {
                  setTimeout(() => {
                    Math.random() < 0.2 ? rej({ status: 410 }) : res({});
                  }, 1000);
                }),
              onDone: "submitted",
              onError: {
                target: "error",
              },
            },
          },

          error: {
            on: {
              SUBMIT: {
                cond: "canSubmit",
                target: "submitting",
              },
            },
          },

          submitted: {
            type: "final",
          },
        },

        onDone: "thanks",
      },

      thanks: {},

      closed: {
        entry: "resetFeedback",
        on: {
          RESTART: "prompt",
        },
      },
    },

    initial: "prompt",

    on: {
      CLOSE: ".closed",
    },
  },
  {
    guards: {
      canSubmit: (context) => context.feedback.trim().length > 0,
    },
    actions: {
      resetFeedback: assign({ feedback: "" }),
      updateFeedback: assign({
        feedback: (context, event) => {
          if (event.type === "UPDATE") {
            return event.value;
          }
          return context.feedback;
        },
      }),
    },
  }
);
