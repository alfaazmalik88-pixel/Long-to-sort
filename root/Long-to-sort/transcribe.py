#!/usr/bin/env python3
import sys
import os
import json

def main():
    if len(sys.argv) < 2:
        print(json.dumps([]))
        return

    audio_path = sys.argv[1]
    if not os.path.exists(audio_path):
        print(json.dumps([]))
        return

    subtitles = []
    try:
        from faster_whisper import WhisperModel
        model = WhisperModel("tiny", device="cpu", compute_type="int8")
        segments, info = model.transcribe(audio_path, beam_size=1, word_timestamps=True)

        idx = 1
        for segment in segments:
            words = []
            if hasattr(segment, 'words') and segment.words:
                for w in segment.words:
                    words.append({
                        "word": w.word.strip().upper(),
                        "start": round(w.start, 2),
                        "end": round(w.end, 2)
                    })
            else:
                # If word timestamps not available, split segment text
                seg_words = segment.text.strip().split()
                if seg_words:
                    w_dur = (segment.end - segment.start) / max(len(seg_words), 1)
                    for i, sw in enumerate(seg_words):
                        words.append({
                            "word": sw.upper(),
                            "start": round(segment.start + (i * w_dur), 2),
                            "end": round(segment.start + ((i + 1) * w_dur), 2)
                        })

            if words:
                subtitles.append({
                    "id": str(idx),
                    "startTime": round(segment.start, 2),
                    "endTime": round(segment.end, 2),
                    "text": segment.text.strip().upper(),
                    "words": words
                })
                idx += 1

        print(json.dumps(subtitles))
    except Exception as e:
        # Return empty list on failure so caller can handle fallback
        print(json.dumps([]))

if __name__ == "__main__":
    main()
