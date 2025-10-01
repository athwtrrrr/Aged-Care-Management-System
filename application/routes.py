from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from application import get_db
from application.auth import has_permission  # Correct import for shared helper
from application.models import Staff, Resident

routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/')
@routes_bp.route('/index')
@routes_bp.route('/home')
def index():
    return render_template('index.html', home=True)

@routes_bp.route('/admin_dashboardresident')
def admin_dashboardresident():
    if not has_permission('manage_users'):
        return redirect(url_for('auth.login'))
    return render_template('admin_dashboardresident.html', admin_dashboardresident=True)

@routes_bp.route('/residents', methods=['GET'])
def get_residents():
    # Check if the user has either 'view_family_portalresidents' or 'manage_users' permission
    if not (has_permission('view_family_portalresidents') or has_permission('manage_users')):
        return jsonify({'error': 'Unauthorized'}), 403

    residents = Resident.get_all_residents()
    return jsonify({'residents': residents})

@routes_bp.route('/add_resident', methods=['POST'])
def add_resident():
    if not has_permission('manage_users'):
        return jsonify({'error': 'Unauthorized'}), 403

    try:
        data = request.get_json()
        name = data.get('name')
        age = data.get('age')
        room_number = data.get('room_number')
        carer_assigned = data.get('carer_assigned')
        date_admitted = data.get('date_admitted')
        reason_for_stay = data.get('reason_for_stay')

        # Validate required fields
        if not all([name, age, room_number, carer_assigned, date_admitted, reason_for_stay]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Add the resident to the database
        Resident.add_resident(name, age, room_number, carer_assigned, date_admitted, reason_for_stay)
        return jsonify({'success': True}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@routes_bp.route('/admin_staff_directory')
def admin_staff_directory():
    if not has_permission('manage_users'):
        return redirect(url_for('auth.login'))
    
    staff = Staff.get_all_staff()  # Add this line to fetch staff data
    return render_template('admin_staff_directory.html', 
                         admin_staff_directory=True,
                         staff=staff)  # Pass staff data to template


from flask import jsonify

@routes_bp.route('/add_staff', methods=['POST'])
def add_staff():
    if not has_permission('view_staff_directory'):
        return jsonify({'error': 'Unauthorized'}), 403
    
    name = request.form['name']
    position = request.form['position']
    email = request.form['email']
    phone = request.form['phone']
    extension = request.form['extension']
    department = request.form['department']
    
    # Add staff to the database
    Staff.add_staff(name, position, email, phone, extension, department)
    
    # Return the new staff data as JSON
    return jsonify({
        'name': name,
        'position': position,
        'email': email,
        'phone': phone,
        'extension': extension,
        'department': department
    })

@routes_bp.route('/staff_directory')
def staff_directory():
    if not has_permission('view_staff_directory'):
        return redirect(url_for('auth.login'))
    
    staff = Staff.get_all_staff()  # Fetch staff data from the database
    return render_template('staff_directory.html', staff=staff)

@routes_bp.route('/services')
def services():
    if not has_permission('view_services'):
        return redirect(url_for('auth.login'))
    return render_template('services.html', services=True)

from flask import request, jsonify
from application.models import Inventory

@routes_bp.route('/inventory', methods=['GET'])
def inventory():
    if not has_permission('manage_inventory'):
        return redirect(url_for('auth.login'))
    
    items = Inventory.get_all_items()  # Fetch all inventory items

    # Check if the request is an AJAX request
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'items': items})  # Return JSON data for AJAX requests

    return render_template('inventory.html', items=items)

@routes_bp.route('/add_inventory_item', methods=['POST'])
def add_inventory_item():
    try:
        # Parse JSON data from the request
        data = request.get_json()
        name = data.get('name')
        category = data.get('category')
        quantity = data.get('quantity')
        expiry_date = data.get('expiry_date') or None
        restock_level = data.get('restock_level')

        # Validate required fields
        if not name or not category or quantity is None or restock_level is None:
            return jsonify({'error': 'Missing required fields'}), 400

        # Add the item to the database
        Inventory.add_item(name, category, quantity, expiry_date, restock_level)
        return jsonify({'success': True}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes_bp.route('/family_portalresident')
def family_portalresident():
    if not has_permission('view_family_portalresidents'):
        return redirect(url_for('auth.login'))
    return render_template('family_portalresident.html', family_portalresident=True)

@routes_bp.route('/booking')
def booking():
    if not has_permission('view_family_portalresidents'):
        return redirect(url_for('auth.login'))
    return render_template('booking.html', booking=True)

@routes_bp.route('/logout')
def logout():
    # Clear the user session
    session.clear()
    # Flash a logout message
    flash('You have been successfully logged out', 'success')
    # Redirect to login page or home page
    return redirect(url_for('auth.login'))  # or 'routes.index' if you prefer