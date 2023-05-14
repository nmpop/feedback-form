import { useMachine } from "@xstate/react";
import { feedbackMachine } from "./feedbackMachine";
import * as React from "react";

export function FeedbackForm() {
  const [state, send] = useMachine(feedbackMachine);

  if (state.matches("closed")) {
    return (
      <>
        <em>Feedback form closed</em>
        <br />
        <button
          className="rounded bg-gray-400 p-2"
          onClick={() => {
            send({
              type: "RESTART",
            });
          }}
        >
          Provide more Feedback
        </button>
      </>
    );
  }

  return (
    <>
      {state.matches("prompt") && (
        <div className="my-2 p-2 bg-white w-4/5 lg:w-3/5 rounded-lg drop-shadow-md">
          <button
            className="fixed top-4 right-4"
            onClick={() => {
              send({
                type: "CLOSE",
              });
            }}
          >
            Close
          </button>
          <h1 className="pt-7 pb-2 px-3 text-xl lg:text-2xl font-bold">
            How was your experience?
          </h1>
          <div className="px-3 py-4 flex gap-2">
            <button
              className="rounded bg-blue-500 p-2 w-24 text-white"
              onClick={() => {
                send({
                  type: "GOOD",
                });
              }}
            >
              Good
            </button>
            <button
              className="rounded bg-blue-500 p-2 w-24 text-white"
              onClick={() => {
                send({
                  type: "BAD",
                });
              }}
            >
              Bad
            </button>
          </div>
        </div>
      )}
      {state.matches("form") && (
        <div className="my-2 p-2 bg-white w-4/5 lg:w-3/5 rounded-lg drop-shadow-md">
          <button
            className="fixed top-4 right-4"
            onClick={() => {
              send({
                type: "CLOSE",
              });
            }}
          >
            Close
          </button>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              send({
                type: "SUBMIT",
              });
            }}
          >
            <h1 className="pt-7 pb-2 px-3 text-xl lg:text-2xl font-bold">
              What can we do better?
            </h1>
            <textarea
              name="feedback"
              value={state.context.feedback}
              rows={4}
              placeholder="Let us know..."
              className="w-4/5 mx-3 px-2 border border-gray-400 rounded"
              onChange={(ev) => {
                send({
                  type: "UPDATE",
                  value: ev.target.value,
                });
              }}
            />
            <div className="px-3 py-4 flex gap-2">
              <button
                className="rounded bg-blue-500 p-2 w-24 text-white"
                disabled={!state.can({ type: "SUBMIT" })}
              >
                {state.matches({ form: "submitting" })
                  ? "Submitting.."
                  : "Submit"}
              </button>
              <button
                className="rounded bg-blue-500 p-2 w-24 text-white"
                onClick={() => {
                  send({
                    type: "BACK",
                  });
                }}
              >
                Back
              </button>
            </div>
            {state.matches({ form: "error" }) && (
              <p className="text-red-500 p-2"> An error occured</p>
            )}
          </form>
        </div>
      )}
      {state.matches("thanks") && (
        <div className="my-2 p-2 bg-white w-4/5 lg:w-3/5 rounded-lg drop-shadow-md">
          <button
            className="fixed top-4 right-4"
            onClick={() => {
              send({
                type: "CLOSE",
              });
            }}
          >
            Close
          </button>
          <h1 className="py-7 px-3 text-xl lg:text-2xl font-bold">
            Thanks for your feedback.
          </h1>
        </div>
      )}
    </>
  );
}
