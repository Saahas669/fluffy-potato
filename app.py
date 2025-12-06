from flask import Flask, render_template, jsonify
import os
import json

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data/movies.json')
def get_movies():
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'movies.json')
    with open(data_path, 'r') as f:
        movies = json.load(f)
    return jsonify(movies)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
