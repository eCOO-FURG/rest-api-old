from flask import Flask, jsonify

from routes import main_bp

app = Flask(__name__)

app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
