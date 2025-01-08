from flask import Flask, request, jsonify
import papermill as pm

app = Flask(__name__)

@app.route('/run-notebook', methods=['POST'])
def run_notebook():
    notebook_path = request.json.get('notebook_path')
    params = request.json.get('params', {})  # Parameters for the notebook

    output_path = f"output-{notebook_path.split('/')[-1]}"
    try:
        # Execute the notebook with papermill
        pm.execute_notebook(
            notebook_path,
            output_path,
            parameters=params
        )
        return jsonify({"status": "success", "output": output_path})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
