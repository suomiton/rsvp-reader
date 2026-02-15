import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayOne } from "@icon-park/react";
import { useAppState } from "../state/context";
import { tokenize } from "../lib/tokenize";
import { buildRenderModels } from "../lib/renderModel";
import { PageShell } from "../components/PageShell";
import { TextArea } from "../components/TextArea";
import { PrimaryButton } from "../components/PrimaryButton";

const PLACEHOLDER_TEXT = `Rapid Serial Visual Presentation (RSVP) is a reading technique where words are shown one at a time in the same position on the screen. Instead of moving your eyes across lines of text, the text comes to you. This reduces eye movement and allows you to focus entirely on recognition and comprehension.
In traditional reading, your eyes perform small jumps called saccades. Between these jumps, your brain processes clusters of letters. RSVP removes most of this movement. Because the word appears in a fixed position, your eyes stay still and your brain can dedicate more effort to recognizing meaning rather than coordinating motion.
Many RSVP systems highlight a specific letter inside each word. This letter is often placed near the center of the word and is called the Optimal Recognition Point. By anchoring your attention to a consistent position, recognition becomes faster and more stable, especially at higher speeds.
The speed of presentation is usually measured in words per minute. Beginners might start around two hundred to three hundred words per minute. With practice, readers often increase the speed significantly. However, comprehension depends on familiarity with the subject and the complexity of the language.
RSVP works in multiple languages, including English and Finnish. The technique does not depend on grammar rules but on visual recognition of word shapes. As long as the system handles special characters correctly, such as ä, ö, and å, the experience remains smooth and readable.
One of the key advantages of RSVP is focus. Because only one word is visible at a time, distractions are minimized. There are no surrounding paragraphs competing for attention. This can make the method especially useful on small screens or in environments where concentration matters.
At the same time, RSVP is not ideal for every type of content. Dense technical material, mathematical formulas, or text that requires frequent backtracking can feel more difficult. That is why many implementations allow pausing, rewinding, or adjusting the speed dynamically.
In practice, RSVP becomes a rhythm. You hold a key, the words flow forward, and your mind follows the narrative in a steady stream. When you release the key, the motion stops instantly, giving you full control over the pace.
By combining controlled timing, visual anchoring, and minimal eye movement, RSVP offers a modern and efficient way to experience written text.`;

export function EditorPage() {
	const { state, dispatch } = useAppState();
	const navigate = useNavigate();
	const [localText, setLocalText] = useState(state.text);

	function handleSubmit() {
		const textToUse = localText.trim() || PLACEHOLDER_TEXT;

		dispatch({ type: "CLEAR_ERROR" });
		dispatch({ type: "SET_TEXT", payload: textToUse });

		const tokens = tokenize(textToUse);
		const models = buildRenderModels(tokens);
		dispatch({ type: "PREPARE_READING", payload: { tokens, models } });

		navigate("/read");
	}

	return (
		<PageShell className="items-center justify-center">
			<div className="w-full max-w-[640px] flex flex-col gap-3 px-3 py-3 max-h-screen">
				<h1 className="text-heading text-white font-bold flex-shrink-0">RSVP Reader</h1>
				<TextArea
					value={localText}
					onChange={setLocalText}
					placeholder={PLACEHOLDER_TEXT}
					rows={6}
					className="flex-1 min-h-0"
				/>
				{state.error && <p className="text-amber text-sm flex-shrink-0">{state.error}</p>}
				<PrimaryButton onClick={handleSubmit} className="flex-shrink-0">
					<span className="flex items-center gap-1">
						<PlayOne theme="filled" size="18" fill="#000000" />
						Lets read
					</span>
				</PrimaryButton>
			</div>
		</PageShell>
	);
}
