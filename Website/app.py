from flask import Flask, request, jsonify
from model import EnhancedVideoChatbot
import os
import tempfile

app = Flask(__name__)
chatbot = EnhancedVideoChatbot(
    cache_dir="/app/video_cache",
    log_file="/app/logs/chatbot.log"
)

@app.route('/api/process_video', methods=['POST'])
def process_video():
    try:
        if 'video' not in request.files or 'question' not in request.form:
            return jsonify({'error': 'Missing video file or question'}), 400

        video_file = request.files['video']
        question = request.form['question']

        # Save the uploaded video to a temporary file
        temp_dir = tempfile.mkdtemp()
        video_path = os.path.join(temp_dir, video_file.filename)
        video_file.save(video_path)

        # Process the video and get response
        response = chatbot.get_response(question, video_path)

        # Clean up temporary file
        os.remove(video_path)
        os.rmdir(temp_dir)

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

