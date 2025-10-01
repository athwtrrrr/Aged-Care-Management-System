from application import get_db

class Staff:
    @staticmethod
    def get_all_staff():
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM staff")
        staff = cur.fetchall()
        cur.close()
        conn.close()
        return staff

    @staticmethod
    def add_staff(name, position, email, phone, extension, department):
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO staff (name, position, email, phone, extension, department)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (name, position, email, phone, extension, department))
        conn.commit()
        cur.close()
        conn.close()

class Inventory:
    @staticmethod
    def get_all_items():
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM inventory")
        items = cur.fetchall()
        cur.close()
        conn.close()
        return items

    @staticmethod
    def add_item(name, category, quantity, expiry_date, restock_level):
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO inventory (name, category, quantity, expiry_date, restock_level)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, category, quantity, expiry_date, restock_level))
        conn.commit()
        cur.close()
        conn.close()

class Resident:
    @staticmethod
    def get_all_residents():
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM residents")
        residents = cur.fetchall()
        cur.close()
        conn.close()
        return residents

    @staticmethod
    def add_resident(name, age, room_number, carer_assigned, date_admitted, reason_for_stay):
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO residents (name, age, room_number, carer_assigned, date_admitted, reason_for_stay)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (name, age, room_number, carer_assigned, date_admitted, reason_for_stay))
        conn.commit()
        cur.close()
        conn.close()