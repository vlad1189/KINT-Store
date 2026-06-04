import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
ROOT_DIR = Path(__file__).parent
firebase_config_path = os.environ.get('FIREBASE_CONFIG_PATH', 'firebase_config.json')
config_path = ROOT_DIR / firebase_config_path
cred = credentials.Certificate(str(config_path))
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

def reset():
    products_ref = db.collection('products')
    docs = products_ref.get()
    
    deleted_count = 0
    for doc in docs:
        products_ref.document(doc.id).delete()
        deleted_count += 1
    
    print(f'Deleted {deleted_count} products')
    print('Restart the backend to re-seed products with new fields')

reset()