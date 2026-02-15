import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/context";
import { tokenize } from "../lib/tokenize";
import { buildRenderModels } from "../lib/renderModel";
import { PageShell } from "../components/PageShell";
import { TextArea } from "../components/TextArea";
import { PrimaryButton } from "../components/PrimaryButton";

export function EditorPage() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [localText, setLocalText] = useState(state.text);

  function handleSubmit() {
    const trimmed = localText.trim();

    if (trimmed.length === 0) {
      dispatch({ type: "SET_ERROR", payload: "Please enter some text" });
      return;
    }

    dispatch({ type: "CLEAR_ERROR" });
    dispatch({ type: "SET_TEXT", payload: localText });

    const tokens = tokenize(localText);
    const models = buildRenderModels(tokens);
    dispatch({ type: "PREPARE_READING", payload: { tokens, models } });

    navigate("/read");
  }

  return (
    <PageShell className="items-center justify-center">
      <div className="w-full max-w-[640px] flex flex-col gap-3 px-3">
        <h1 className="text-heading text-white font-bold mb-2">
          RSVP Reader
        </h1>
        <TextArea
          value={localText}
          onChange={setLocalText}
          placeholder="Paste or type your text here..."
        />
        {state.error && (
          <p className="text-amber text-sm">{state.error}</p>
        )}
        <PrimaryButton onClick={handleSubmit}>Lets read</PrimaryButton>
      </div>
    </PageShell>
  );
}
