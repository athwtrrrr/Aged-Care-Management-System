from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from application import get_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            SELECT u.*, r.role_name 
            FROM users u
            JOIN user_roles ur ON u.user_id = ur.user_id
            JOIN roles r ON ur.role_id = r.role_id
            WHERE u.username = %s
        """, (username,))
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        from werkzeug.security import check_password_hash
        if user and (user['password_hash'] == password or check_password_hash(user['password_hash'], password)):
            session['user_id'] = user['user_id']
            session['username'] = user['username']
            session['role'] = user['role_name']
            
            # Redirect based on role
            if user['role_name'] == 'admin':
                return redirect(url_for('routes.admin_dashboardresident'))
            elif user['role_name'] == 'staff':
                return redirect(url_for('routes.staff_directory'))
            elif user['role_name'] == 'resident':
                return redirect(url_for('routes.family_portalresident'))  # Ensure this route exists
        else:
            flash('Invalid username or password', 'danger')
    
    return render_template('login.html', login=True)

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('routes.index'))  # Redirect to homepage

def has_permission(permission_name):
    if 'user_id' not in session:
        return False
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT COUNT(*) AS count
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = %s AND p.permission_name = %s
    """, (session['user_id'], permission_name))
    result = cur.fetchone()
    cur.close()
    conn.close()
    
    return result['count'] > 0
