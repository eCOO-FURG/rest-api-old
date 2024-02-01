from flask import Blueprint, request, jsonify

from search import search

main_bp = Blueprint('main', __name__)

@main_bp.errorhandler(500)
def internal_server_error(e):
     return jsonify({"message": "Internal server error."}), 500

@main_bp.route('/products/infer')
def infer():
    query = request.args.get('q')

    if query is None:
        return jsonify({'error': 'Missing query parameter'}), 400

    intention = search('products', query)[0]

    return jsonify(intention)
