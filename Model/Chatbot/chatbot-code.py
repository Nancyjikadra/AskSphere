import os
import numpy as np
import torch
import json
from transformers import pipeline
import whisper
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import librosa

class VideoQAPipeline:
    def __init__(self, cache_dir="video_cache"):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)

        # Initialize models
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.transcription_model = whisper.load_model("base", device=self.device)
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2", device=0 if torch.cuda.is_available() else -1)

    def extract_audio(self, video_path):
        """Extract audio from a video file."""
        audio_array, _ = librosa.load(video_path, sr=16000, mono=True)
        return audio_array.astype(np.float32)

    def transcribe_audio(self, audio_array):
        """Transcribe audio using Whisper."""
        return self.transcription_model.transcribe(audio_array)

    def process_video(self, video_path):
        """Extract audio and transcribe the video."""
        video_id = os.path.basename(video_path)
        cache_file = os.path.join(self.cache_dir, f"{video_id}_transcription.json")

        if os.path.exists(cache_file):
            with open(cache_file, 'r') as f:
                return json.load(f)

        audio_array = self.extract_audio(video_path)
        transcription = self.transcribe_audio(audio_array)

        with open(cache_file, 'w') as f:
            json.dump(transcription, f)

        return transcription

    def get_embeddings(self, texts):
        """Generate embeddings for a list of texts."""
        return self.embedding_model.encode(texts)

    def select_videos(self, question, video_transcripts, top_k=2):
        """Select top-K relevant videos based on a question."""
        question_embedding = self.get_embeddings([question])
        video_embeddings = self.get_embeddings(video_transcripts)

        similarities = cosine_similarity(question_embedding, video_embeddings)[0]
        top_indices = np.argsort(similarities)[::-1][:top_k]

        return [video_transcripts[i] for i in top_indices]

    def find_relevant_context(self, query, transcription_data):
        """Find the most relevant context from transcriptions."""
        query_embedding = self.get_embeddings([query])
        segment_texts = [segment["text"] for segment in transcription_data["segments"]]
        segment_embeddings = self.get_embeddings(segment_texts)

        similarities = cosine_similarity(query_embedding, segment_embeddings)[0]
        top_indices = np.argsort(similarities)[-3:]

        return " ".join(segment_texts[i] for i in top_indices)

    def answer_questions(self, questions, video_paths):
        """Answer a list of questions based on selected videos."""
        responses = {}
        video_transcripts = []

        for video_path in video_paths:
            transcription_data = self.process_video(video_path)
            video_transcripts.append(transcription_data["text"])

        for question in questions:
            selected_videos = self.select_videos(question, video_transcripts)
            combined_context = " ".join(selected_videos)

            answer = self.qa_pipeline(question=question, context=combined_context, max_answer_length=100)
            responses[question] = {
                "answer": answer["answer"],
                "confidence": answer["score"],
                "context": combined_context
            }

        return responses

# Example usage
if __name__ == "__main__":
    video_paths = ["/content/Antimatter.mp4", "/content/videoplayback.mp4","/content/videoplayback (2).mp4","/content/Antimatter.mp4"]
    questions = [
        "what is machine learning?",
        "what is she having in lunch?",
        "why is she cooking?",
        "how swarty house looks like?",
        "What is antimatter?"
    ]

    pipeline = VideoQAPipeline()
    results = pipeline.answer_questions(questions, video_paths)

    for question, result in results.items():
        print(f"Question: {question}")
        print(f"Answer: {result['answer']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Context: {result['context']}")
        print("-" * 50)
