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

def check():
    products_ref = db.collection('products')
    docs = products_ref.limit(10).get()
    
    count = 0
    print('Products in DB:')
    for doc in docs:
        count += 1
        product = doc.to_dict()
        print(f"  - {product.get('name', 'N/A')} (active: {product.get('active', 'N/A')})")
    
    print(f'Total products shown: {count}')

check()