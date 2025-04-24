from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
import json, os
from werkzeug.security import generate_password_hash, check_password_hash

#
DIST_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'Frontend', 'dist'))

app = Flask(__name__)
app.secret_key = "GVSU2003"
CORS(app, supports_credentials=True, origins=["http://localhost:5173"], allow_headers=["Content-Type"])

@app.route('/')
def serve_home():
    return send_from_directory(DIST_PATH, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(DIST_PATH, path)

USERS_FILE   = 'users.json'
PROMPTS_FILE = 'prompts.json'
SAVED_FILE   = 'saved.json'

def load_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

def save_users(u):
    with open(USERS_FILE, 'w') as f:
        json.dump(u, f, indent=2)

def load_prompts():
    if os.path.exists(PROMPTS_FILE):
        try:
            with open(PROMPTS_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

def save_prompts(p):
    with open(PROMPTS_FILE, 'w') as f:
        json.dump(p, f, indent=2)

def load_saved():
    if os.path.exists(SAVED_FILE):
        try:
            with open(SAVED_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

def save_saved(s):
    with open(SAVED_FILE, 'w') as f:
        json.dump(s, f, indent=2)

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json() or {}
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        if not email or not username or not password:
            return jsonify({'success': False, 'error': 'Missing fields'}), 400

        users = load_users()
        if email in users:
            return jsonify({'success': False, 'error': 'Email already registered'}), 400

        users[email] = {
            'username': username,
            'password': generate_password_hash(password)
        }
        save_users(users)

        session['user'] = {'email': email, 'username': username}
        return jsonify({'success': True, 'user': session['user']})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        username = data.get('username')
        password = data.get('password')

        users = load_users()
        user_email = None
        user_data = None
        for email, u in users.items():
            if u.get('username') == username:
                user_email = email
                user_data = u
                break

        if user_data and check_password_hash(user_data['password'], password):
            session['user'] = {'email': user_email, 'username': username}
            return jsonify({'success': True, 'user': session['user']})
        else:
            return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'success': True})

@app.route('/api/user', methods=['GET'])
def get_user():
    user = session.get('user')
    return (jsonify({'user': user}), 200) if user else (jsonify({'user': None}), 401)

@app.route('/api/user', methods=['PUT'])
def update_user():
    try:
        user = session.get('user')
        if not user:
            return jsonify({'success': False, 'error': 'Not logged in'}), 401

        data = request.get_json() or {}
        new_username = data.get('username')
        new_password = data.get('password')

        if new_username:
            user['username'] = new_username
        if new_password:
            user['password'] = generate_password_hash(new_password)

        users = load_users()
        users[user['email']] = {
            'username': user['username'],
            'password': user['password']
        }
        save_users(users)
        session['user'] = {'email': user['email'], 'username': user['username']}
        return jsonify({'success': True, 'user': session['user']})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/prompts', methods=['GET'])
def get_prompts():
    try:
        prompts = load_prompts()
        category = request.args.get('category')

        if category:
            results = []
            for owner_email, plist in prompts.items():
                for p in plist:
                    if p.get('category') == category and p.get('public', True):
                        item = p.copy()
                        item['owner'] = owner_email
                        results.append(item)
            return jsonify({'success': True, 'prompts': results})

        user = session.get('user')
        if not user:
            return jsonify({'success': False, 'error': 'Not logged in'}), 401
        return jsonify({'success': True, 'prompts': prompts.get(user['email'], [])})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/prompts', methods=['POST'])
def add_prompt():
    try:
        user = session.get('user')
        if not user:
            return jsonify({'success': False, 'error': 'Not logged in'}), 401

        data = request.get_json() or {}
        content = data.get('content')
        category = data.get('category')
        public = data.get('public', True)
        description = data.get('description')

        if not content or not category:
            return jsonify({'success': False, 'error': 'Prompt content and category are required'}), 400

        prompts = load_prompts()
        user_prompts = prompts.get(user['email'], [])

        new_prompt = {
            'id': len(user_prompts) + 1,
            'content': content,
            'category': category,
            'description': description,
            'username': user.get('username', 'Anonymous'),
            'favorite': False,
            'public': bool(public)
        }

        user_prompts.append(new_prompt)
        prompts[user['email']] = user_prompts
        save_prompts(prompts)

        return jsonify({'success': True, 'prompt': new_prompt})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/update-prompt', methods=['PUT'])
def update_prompt():
    try:
        user = session.get('user')
        if not user:
            return jsonify({'success': False, 'error': 'Not logged in'}), 401

        data = request.get_json() or {}
        prompt_id = data.get('id')
        new_content = data.get('content')
        new_category = data.get('category')
        new_public = data.get('public')
        new_description = data.get('description')
        prompts = load_prompts()
        user_prompts = prompts.get(user['email'], [])
        updated = False
        for p in user_prompts:
            if p['id'] == prompt_id:
                if new_content is not None:
                    p['content'] = new_content
                if new_description is not None:
                    p['description'] = new_description
                if new_category is not None:
                    p['category'] = new_category
                if new_public is not None:
                    p['public'] = bool(new_public)
                updated = True
                break

        if not updated:
            return jsonify({'success': False, 'error': 'Prompt not found'}), 404
        prompts[user['email']] = user_prompts
        save_prompts(prompts)
        return jsonify({'success': True, 'prompts': user_prompts})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/delete-prompt', methods=['DELETE'])
def delete_prompt():
    try:
        user = session.get('user')
        if not user:
            return jsonify({'success': False, 'error': 'Not logged in'}), 401

        data = request.get_json() or {}
        prompt_id = data.get('id')

        prompts = load_prompts()
        user_prompts = prompts.get(user['email'], [])
        new_list = [p for p in user_prompts if p['id'] != prompt_id]
        if len(new_list) == len(user_prompts):
            return jsonify({'success': False, 'error': 'Prompt not found'}), 404
        prompts[user['email']] = new_list
        save_prompts(prompts)
        return jsonify({'success': True, 'prompts': new_list})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/favorite-prompt', methods=['PUT'])
def favorite_prompt():
    try:
        user = session.get('user')
        if not user:
            return jsonify({'success': False, 'error': 'Not logged in'}), 401

        data = request.get_json() or {}
        prompt_id = data.get('id')
        owner = data.get('owner')
        fav = data.get('favorite', True)

        all_prompts = load_prompts().get(owner, [])
        prompt = next((p for p in all_prompts if p['id'] == prompt_id), None)
        if not prompt:
            return jsonify({'success': False, 'error': 'Prompt not found'}), 404

        saved = load_saved()
        my_list = saved.get(user['email'], [])

        if fav:
            if not any(p['owner'] == owner and p['id'] == prompt_id for p in my_list):
                entry = {**prompt, 'owner': owner}
                my_list.append(entry)
        else:
            my_list = [p for p in my_list if not (p['owner'] == owner and p['id'] == prompt_id)]

        saved[user['email']] = my_list
        save_saved(saved)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/saved-prompts', methods=['GET'])
def get_saved_prompts():
    try:
        user = session.get('user')
        if not user:
            return jsonify({'success': False, 'error': 'Not logged in'}), 401
        saved = load_saved().get(user['email'], [])
        return jsonify({'success': True, 'prompts': saved})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
